import {gql} from 'apollo-server-express';

import models from '../../models';


export default class Review {

   static resolver() {
      return {

         Query: {

            getReviews: async (parent, {}, context) => {

               const reviews = await models.Review.findAll();

               const url = context.req.protocol + '://' + context.req.get('host');

               for (const review of reviews) {
                  const user = await review.getUser({include: models.UserInformation});
                  review.userAvatarUrl = `${url}/storage/files/user/avatars/${user.UserInformation.avatar}`;
               }

               return reviews;

            }

         },
      }
   }

   static typeDefs() {
      return gql`

      type Review {
         tourId: Int
         userId: Int
         userFullName: String
         userAvatarUrl: String
         assessment: Int
         text: String
         createdAt: String
      }


      `
   }

}