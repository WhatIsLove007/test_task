import {gql} from 'apollo-server-express';

import models from '../../models';



export default class User {

   static resolver() {
      return {

         Query: {

            getPhotocards: async (parent, {}, context) => {

               await models.Photocard.findAll({});

               // in process...

            },

         },

      }
   }


   static typeDefs() {
      return gql`

      `
   }

}