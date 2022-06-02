import {gql, UserInputError, ForbiddenError} from 'apollo-server-express';
import { Sequelize, sequelize } from '../../models/index.js';
import {GraphQLUpload} from 'graphql-upload';
import fs from 'fs';
import { finished } from 'stream/promises';
import path from 'path';

import models from '../../models';
import * as inputDataValidation from '../../utils/inputDataValidation.js';
import * as passwordHashing from '../../utils/passwordHashing.js';
import * as userAuthentication from '../../utils/userAuthentication.js';
import {
   USER_STATUSES, 
   USER_ROLES, 
   ERROR_MESSAGES, 
   ORDER_STATUSES, 
   TOKEN_LIFETIME,
   DEFAULT_FILTERING_VALUES,
} from '../../config/const.js';
import * as checkUserRights from '../../utils/checkUserRights.js';
import * as nodemailer from '../../utils/nodemailer.js';
import * as crypto from '../../utils/crypto.js';

export default class User {

   static resolver() {
      return {
         Upload: GraphQLUpload,

         UserProfile: {
            userInformation: user => user.getUserInformation(),
            userAddress: user => user.getUserAddress({include: 'country'}),
            userPreferences: user => user.getUserPreferences(),
         },

         Query: {
            signin: async (parent, {input}) => {
               const {emailOrLogin, password} = input;

               const user = await models.User.findOne({
                  where: {
                     ...(inputDataValidation.validateEmail(emailOrLogin)? {email: emailOrLogin} : 
                        {login: emailOrLogin}),
                  },
               });

               if (!user) throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);

               if ( !(await passwordHashing.compare(password, user.passwordHash)) ) {
                  throw new Error('Wrong password');
               }

               return {authorization: userAuthentication.generateAccessToken(user.id, user.login)};
            },

            getUserProfile: async (parent, {photocardsLimit, photocardsOffset}, context) => {
               checkUserRights.checkUserAuthentication(context);

               const user = context.user;

               const userInformation = await user.getUserInformation();
               const userPreferences = await user.getUserPreferences();

               user.profileCompleted = userInformation.calculateProfileCompleteness();

               const url = context.req.protocol + '://' + context.req.get('host');

               const photocards = await models.Photocard.findAll({
                  ...(photocardsLimit? {limit: photocardsLimit} : {limit: DEFAULT_FILTERING_VALUES.PHOTOCARDS_LIMIT}),
                  ...(photocardsOffset? {offset: photocardsOffset} : {offset: 0}),
                  include: {
                     model: models.FavoritePhotocard,
                     where: {
                        userId: user.id,
                     },
                     required: false,
                  },
               });

               user.favoritePhotocards = [];
               for (const photocard of photocards) {
                  photocard.urlPath = `${url}/storage/files/photocards/${photocard.fileName}`;

                  if (photocard.FavoritePhotocards.length) {
                     const favoritePhotocard = photocard;
                     favoritePhotocard.urlPath = `${url}/storage/files/photocards/${photocard.fileName}`;
                     user.favoritePhotocards.push(favoritePhotocard);
                  }
               }

               user.photocards = photocards;

               if (userInformation.avatar) {
                  user.userAvatarUrl = `${url}/storage/files/user/avatars/${userInformation.avatar}`;
               }

               return user;
            },

         },

         Mutation: {
            signup: async (parent, {file, input}) => {
               const { 
                  login, email, password,
                  repeatingPassword, firstName, lastName, 
                  gender, birthdate, about, countryId, 
                  city, zipCode, address, additionalAddress, 
                  desiredVacationFrom, desiredVacationUntil, iAgreeCheckbox
               } = input;

               models.UserInformation.validateBirthdate(birthdate);
               if (!iAgreeCheckbox) throw new ForbiddenError("USER DOES NOT AGREE WITH THE TERMS");
               
               if (password !== repeatingPassword) throw new UserInputError('Passwords do not match');
               models.User.validateLogin(login);
               models.User.validateEmail(email);
               models.User.validatePassword(password);
               
               inputDataValidation.checkFilledFields([firstName, lastName, birthdate, city, zipCode, address]);

               await models.User.checkLoginExistence(login);
               await models.User.checkEmailExistence(email);

               const country = await models.Country.findByPk(countryId);
               if (!country) throw new Error(ERROR_MESSAGES.COUNTRY_NOT_FOUND);

               const transaction = await sequelize.transaction();

               try {
                  const user = await models.User.create({
                     login,
                     email,
                     passwordHash: await passwordHashing.hash(password),
                  }, {transaction});

                  const avatarName = await models.User.saveAvatar(file, user.id);

                  const userInformation = await user.createUserInformation({
                     firstName, 
                     lastName, 
                     ...(gender? {gender} : {}),
                     birthdate, 
                     ...(about? {about} : {}),
                     ...(desiredVacationFrom? {desiredVacationFrom} : {}), 
                     ...(desiredVacationUntil? {desiredVacationUntil} : {}),
                     ...(avatarName? {avatar: avatarName} : {}),
                  }, {transaction});

                  await user.createUserAddress({
                     countryId,
                     city,
                     zipCode,
                     address,
                     ...(additionalAddress? {additionalAddress} : {}),
                  }, {transaction});

                  await user.createUserToken({}, {transaction});

                  await transaction.commit();
                  
                  return {authorization: userAuthentication.generateAccessToken(user.id, user.login)};
   
               } catch (error) {
                  transaction.rollback();
                  throw new Error(error);
               }
            },

            sendPasswordResetEmail: async (parent, {emailOrLogin}, context) => {
               const user = await models.User.findOne({
                  where: {
                     ...(inputDataValidation.validateEmail(emailOrLogin)? {email: emailOrLogin} : 
                        {login: emailOrLogin}),
                  },
               });

               if (!user) return {success: false, emailOrLogin};

               const encryptedToken = crypto.encrypt(`${crypto.generateToken(16)}_${Date.now()}`);

               const url = `${context.req.protocol}://${context.req.get('host')}/password-reset/${encryptedToken}`;

               await models.UserToken.update(
                  {encryptedPasswordResetToken: encryptedToken}, 
                  {where: {userId: user.id}},
               );

               await nodemailer.sendPasswordResetEmail(user.email, url);

               return {success: true, emailOrLogin};
            },

            recoverPassword: async (parent, {token, password, repeatingPassword}) => {
               const userTokenRecord = await models.UserToken.findOne({where: {encryptedPasswordResetToken: token}});
               if (!userTokenRecord) throw new Error('WRONG TOKEN');

               const user = await userTokenRecord.getUser();
               
               if (!inputDataValidation.validatePassword(password)) throw new UserInputError('Incorrect password');
               if (password !== repeatingPassword) throw new UserInputError('Passwords do not match');

               const transaction = await sequelize.transaction();

               try {
                  await userTokenRecord.update({encryptedPasswordResetToken: null}, {transaction});

                  const timestamp = parseInt(crypto.decrypt(token).split('_')[1]);

                  if (Date.now() - timestamp > TOKEN_LIFETIME.THREE_DAYS) {
                     throw new Error('TOKEN EXPIRED');
                  }

                  await user.update({passwordHash: await passwordHashing.hash(password)}, {transaction});

                  await transaction.commit();

                  return {authorization: userAuthentication.generateAccessToken(user.id, user.login)};

               } catch (error) {
                  await transaction.rollback();
                  throw new Error(error);
               }
            },

            deleteAccount: async (parent, {}, context) => { 
               checkUserRights.checkUserAuthentication(context);

               const id = context.user.id;

               const userInformation = await models.UserInformation.findByPk(id);

               if (userInformation.avatar) {
                  const avatarPath = path.join(__dirname, `../../uploads/user/avatars/${userInformation.avatar}`);
                  fs.unlinkSync(avatarPath);
               }
               
               await models.User.destroy({where: {id}});
               
               return {success: true};
            },

            editUserProfile: async (parent, {input}, context) => {
               checkUserRights.checkUserAuthentication(context);

               const {profileHeader, firstName, lastName, birthdate, countryId, address, about} = input;

               inputDataValidation.checkFilledFields([firstName, countryId, address, birthdate]);

               if (new Date(birthdate) < new Date(1900, 0, 2) || new Date(birthdate) > new Date()) {
                  throw new UserInputError('INCORRECT DATE')
               }

               const country = await models.Country.findByPk(countryId);
               if (!country) throw new Error(ERROR_MESSAGES.COUNTRY_NOT_FOUND);

               const userInformation = await context.user.getUserInformation();
               const userAddress = await context.user.getUserAddress();

               const transaction = await sequelize.transaction();

               try {
                  await userInformation.update({
                     ...(profileHeader? {profileHeader} : {profileHeader: null}),
                     firstName,
                     birthdate,
                     ...(lastName? {lastName} : {}),
                     ...(about? {about} : {}),
                  }, {transaction});

                  await userAddress.update({
                     countryId,
                     address,
                  }, {transaction});

                  await transaction.commit();

                  return input;
   
               } catch (error) {
                  await transaction.rollback;
                  throw new Error(error);
               }
            },

            addUserAvatar: async (parent, {file}, context) => {
               checkUserRights.checkUserAuthentication(context);

               const transaction = await sequelize.transaction();

               const userInformation = await context.user.getUserInformation();

               try {
                  const avatarName = await models.User.saveAvatar(file, context.user.id);

                  await userInformation.update({avatar: avatarName});

                  await transaction.commit();

                  const url = context.req.protocol + '://' + context.req.get('host');

                  return `${url}/storage/files/user/avatars/${avatarName}`;

               } catch (error) {
                  await transaction.rollback();
                  throw new Error(error);
               }
            },

         }
      }
   }


   static typeDefs() {
      return gql`

         type User {
            id: Int
            login: String
            email: String
            status: Status
            role: Role
            shopId: Int
         }

         type SendPasswordResetEmail {
            emailOrLogin: String!
            success: Boolean!
         }

         type UserProfile {
            profileCompleted: Int
            userAvatarUrl: String
            userInformation: UserInformation
            userAddress: UserAddress
            photocards: [Photocard]
            favoritePhotocards: [Photocard]
            userPreferences: [UserPreference]
         }

         type UserProfileEditing {
            profileHeader: String
            firstName: String
            lastName: String
            birthdate: String
            countryId: Int
            address: String
            about: String
         }

          
         type SwitchFavoritePhotocard {
            photocard: Photocard
            action: Action
         }
         
         type SwitchUserPreference {
            userPreference: UserPreference
            action: Action
         }

         enum Status {
            ${USER_STATUSES.ACTIVE}
            ${USER_STATUSES.BANNED}
         }

         enum Role {
            ${USER_ROLES.CLIENT}
            ${USER_ROLES.MANAGER}
         }

         enum Action {
            ADDED
            DELETED
         }


         input UserSignupInput {
            login: String!
            email: String!
            password: String!
            repeatingPassword: String!
            firstName: String!
            lastName: String!
            gender: Gender
            birthdate: String!
            about: String
            countryId: Int!
            city: String!
            zipCode: String!
            address: String!
            additionalAddress: String
            desiredVacationFrom: String
            desiredVacationUntil: String
            iAgreeCheckbox: Boolean!
         }

         input UserSigninInput {
            emailOrLogin: String!
            password: String!
         }

         input UserProfileEditingInput {
            profileHeader: String
            firstName: String!
            lastName: String
            birthdate: String!
            countryId: Int!
            address: String!
            about: String
         }
      `
   }

}