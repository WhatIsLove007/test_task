import {gql} from 'apollo-server-express';

import {USER_GENDERS} from '../../config/const.js';




export default class UserInformation {


   static typeDefs() {
      return gql`

      type UserInformation {
         userId: Int
         name: String
         surname: String
         gender: Gender
         birthdate: String
         about: String
         avatar: String
         phone: String
         profileHeader: String
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