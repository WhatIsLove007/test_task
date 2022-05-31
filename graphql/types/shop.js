import {gql} from 'apollo-server-express';


export default class Shop {

   static typeDefs() {
      return gql`

      type Shop {
         id: Int
         name: String
         createdAt: String
      }

      `
   }

}