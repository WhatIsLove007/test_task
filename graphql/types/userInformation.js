import {gql} from 'apollo-server-express';
import { sequelize } from '../../models/index.js';

import models from '../../models';
import {USER_GENDERS} from '../../config/const.js';
import {GraphQLUpload} from 'graphql-upload';
import fs from 'fs';
import { finished } from 'stream/promises';




export default class UserInformation {

   static resolver() {
      return {
         
      }
   }


   static typeDefs() {
      return gql`

      type UserInformation {
         userId: Int
         name: String
         surname: String
         gender: Gender
         birthday: String
         about: String
         avatar: String
         phone: String
         profileHeader: String
         like: String
         desiredVacationFrom: String
         desiredVacationUntil: String
      }


      enum Gender {
         ${USER_GENDERS.MALE}
         ${USER_GENDERS.FEMALE}
      }
       
      `
   }

}