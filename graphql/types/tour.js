import {gql} from 'apollo-server-express';

import models from '../../models';

export default class Tour {

   static resolver() {
      return {

         Query: {

            getTourBookingPage: async (parent, {}, context) => {

               const tours = await models.Tour.findAll();

               const reviews = await models.Review.findAll();

               const url = context.req.protocol + '://' + context.req.get('host');

               for (const review of reviews) {
                  const user = await review.getUser({include: models.UserInformation});
                  review.userAvatarUrl = `${url}/storage/files/user/avatars/${user.UserInformation.avatar}`;
               }

               return {tours, reviews};

            }

         },

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

      type TourBookingPage {
         tours: [Tour]
         reviews: [Review]
      }

      
      `
   }

}