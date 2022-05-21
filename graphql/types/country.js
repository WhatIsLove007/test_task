import {gql} from 'apollo-server-express';




export default class Country {

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