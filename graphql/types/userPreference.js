import {gql} from 'apollo-server-express';




export default class UserPreference {

   static typeDefs() {
      return gql`

      type UserPreference {
         userId: Int
         name: String
      }

      `
   }

}