import {gql} from 'apollo-server-express';

import models from '../../models';

export default class Country {

   static resolver() {
      return {

         Query: {
            getCountries: () => models.Country.findAll(),
         },
      }
   }
   
   static typeDefs() {
      return gql`

      type Country {
         id: Int
         name: String
         iso: String
      }

      `
   }

}