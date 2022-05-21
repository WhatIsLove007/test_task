import {gql} from 'apollo-server-express';



export default class UserAddress {


   static typeDefs() {
      return gql`

      type UserAddress {
         userId: Int
         countryId: Int
         city: String
         zipCode: String
         address: String
         additionalAddress: String
         country: Country
      }

       
      `
   }

}