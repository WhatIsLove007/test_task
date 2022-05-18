import {gql} from 'apollo-server-express';
import { sequelize } from '../../models/index.js';
import {GraphQLUpload} from 'graphql-upload';
import fs from 'fs';
import { finished } from 'stream/promises';
import path from 'path';

import models from '../../models';
import * as inputDataValidation from '../../utils/inputDataValidation.js';
import * as passwordHashing from '../../utils/passwordHashing.js';
import * as userAuthentication from '../../utils/userAuthentication.js';
import {USER_STATUSES, USER_ROLES, ERROR_MESSAGES} from '../../config/const.js';
import * as validateFile from '../../utils/validateFile.js';
import * as checkUserRights from '../../utils/checkUserRights.js'



export default class User {

   static resolver() {
      return {
         Upload: GraphQLUpload,


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
         },


         Mutation: {
            
            signup: async (parent, {file, input}) => {

               const { 
                  login, email, password,
                  repeatingPassword, name, 
                  surname, gender, birthdate, 
                  about, countryId, city, zipCode,
                  address, additionalAddress, 
                  desiredVacationFrom, desiredVacationUntil 
               } = input;


               if (password !== repeatingPassword) throw new Error('Passwords do not match');
               if (!inputDataValidation.validateLogin(login)) throw new Error('Incorrect login');
               if (!inputDataValidation.validateEmail(email)) throw new Error('Incorrect email');
               if (!inputDataValidation.validatePassword(password)) throw new Error('Incorrect password');

               const existingLogin = await models.User.findOne({where: {login}});
               if (existingLogin) throw new Error(ERROR_MESSAGES.LOGIN_ALREADY_EXISTS);

               const existingEmail = await models.User.findOne({where: {email}});
               if (existingEmail) throw new Error(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS);

               const country = await models.Country.findByPk(countryId);
               if (!country) throw new Error(ERROR_MESSAGES.COUNTRY_NOT_FOUND);


               const transaction = await sequelize.transaction();

               try {
                  const user = await models.User.create({
                     login,
                     email,
                     passwordHash: await passwordHashing.hash(password),
                  }, {transaction});

                  let avatarName;
                  if (file) {
                     validateFile.isImage(await file);
                     const avatarPath = path.join(__dirname, '../../uploads/user/avatars/');

                     const { createReadStream, filename, mimetype, encoding } = await file;

                     const stream = createReadStream();

                     avatarName = `${user.id}.jpg`;
                     const out = fs.createWriteStream(avatarPath + avatarName);

                     stream.pipe(out);
                     await finished(out);
                  }
   
                  await user.createUserInformation({
                     name, 
                     surname, 
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


                  await transaction.commit();
                  
                  return {authorization: userAuthentication.generateAccessToken(user.id, user.login)};
   
               } catch (error) {
                  console.log(error);
                  transaction.rollback();
               }
            },

            deleteAccount: async (parent, {id}, context) => {

               checkUserRights.checkId(context, id);

               const userInformation = await models.UserInformation.findByPk(id);

               if (userInformation.avatar) {
                  const avatarPath = path.join(__dirname, `../../uploads/user/avatars/${userInformation.avatar}`);
                  fs.unlinkSync(avatarPath);
               }
               
               await models.User.destroy({where: {id}});
               
               return {success: true};
            }

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

         enum Status {
            ${USER_STATUSES.ACTIVE}
            ${USER_STATUSES.BANNED}
         }

         enum Role {
            ${USER_ROLES.CLIENT}
            ${USER_ROLES.MANAGER}
         }


         input UserSignupInput {
            login: String!
            email: String!
            password: String!
            repeatingPassword: String!
            name: String!
            surname: String!
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
         }

         input UserSigninInput {
            emailOrLogin: String!
            password: String!
         }
      `
   }

}