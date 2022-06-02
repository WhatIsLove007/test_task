import {gql} from 'apollo-server-express';

import * as checkUserRights from '../../utils/checkUserRights.js';

export default class UserPreference {

   static resolver() {
      return {

         Mutation: {
            switchUserPreference: async (parent, {preferenceName}, context) => {
               checkUserRights.checkUserAuthentication(context);

               const user = context.user;
               const userPreferences = await user.getUserPreferences({where: {name: preferenceName}});

               if (!userPreferences.length) {
                  const userPreference = await user.createUserPreference({name: preferenceName});
                  return {userPreference: userPreference, action: 'ADDED'};
               } else {
                  return {userPreference: await userPreferences[0].destroy(), action: 'DELETED'};
               }
            },
         }
      }
   }


   static typeDefs() {
      return gql`
         type UserPreference {
            userId: Int
            name: String
         }
      `
   }

}