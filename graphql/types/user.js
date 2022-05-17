import {gql} from 'apollo-server-express';
import { sequelize } from '../../models/index.js';

import models from '../../models';
import * as inputDataValidation from '../../utils/inputDataValidation.js';
import * as passwordHashing from '../../utils/passwordHashing.js';
import {USER_STATUSES, USER_ROLES, ERROR_MESSAGES, USER_GENDERS} from '../../config/const.js';



export default class User {

   static resolver() {
      return {

         Mutation: {

            signupFirstStep: async (parent, {input}) => {

               const { login, email, password, repeatingPassword } = input;

               if (password !== repeatingPassword) throw new Error('Passwords do not match');
               if (!inputDataValidation.validateLogin(login)) throw new Error('Incorrect login');
               if (!inputDataValidation.validateEmail(email)) throw new Error('Incorrect email');
               if (!inputDataValidation.validatePassword(password)) throw new Error('Incorrect password');

               const existingLogin = await models.User.findOne({where: {login}});
               if (existingLogin) throw new Error(ERROR_MESSAGES.LOGIN_ALREADY_EXISTS);

               const existingEmail = await models.User.findOne({where: {email}});
               if (existingEmail) throw new Error(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS);

               return models.User.create({
                  login,
                  email,
                  passwordHash: await passwordHashing.hash(password),
               });

            },

            signupSecondStep: async (parent, {input}) => {

               const { login, email, password, repeatingPassword } = input;

               // ... in process


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

         enum Status {
            ${USER_STATUSES.IN_THE_PROCESS_OF_REGISTRATION}
            ${USER_STATUSES.ACTIVE}
            ${USER_STATUSES.BANNED}
         }

         enum Role {
            ${USER_ROLES.CLIENT}
            ${USER_ROLES.MANAGER}
         }

         enum Gender {
            ${USER_GENDERS.MALE}
            ${USER_GENDERS.FEMALE}
         }


         input SignupFirstStepInput {
            login: String!
            email: String!
            password: String!
            repeatingPassword: String!
         }

         input SignupSecondStepInput {
            name: String!
            surname: String!
            gender: Gender!
            birthdate: String!
            about: String
            avatar: String
         }

        
      `
   }

}