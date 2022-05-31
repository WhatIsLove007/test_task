import {gql} from 'apollo-server-express';

import models from '../../models';
import { ERROR_MESSAGES } from '../../config/const.js';

export default class Tour {

   static resolver() {
      return {

         Query: {

            getTours: () => models.Tour.findAll()},

      }
   }


   static typeDefs() {
      return gql`

      type Tour {
         id: Int
         shopId: Int
         managerId: Int
         name: String
         info: String
         price: Int
      }

      input BookTourInput {
         fullName: String!
         phone: String!
         date: String!
         tourId: Int!
      }

      
      `
   }

}