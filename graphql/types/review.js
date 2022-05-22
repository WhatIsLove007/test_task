import {gql} from 'apollo-server-express';

import models, { Sequelize } from '../../models';
import * as checkUserRights from '../../utils/checkUserRights.js';
import { ERROR_MESSAGES } from '../../config/const';


export default class Review {

   static resolver() {
      return {

         Mutation: {

            addReview: async (parent, {tourId, assessment, text}, context) => {

               checkUserRights.checkUserAuthentication(context);

               const user = context.user;

               const tour = await models.Tour.findByPk(tourId);
               if (!tour) throw new Error(ERROR_MESSAGES.TOUR_NOT_FOUND);

               const userInformation = await user.getUserInformation({
                  attributes: [
                     [Sequelize.fn('CONCAT', Sequelize.col('surname'), ' ', Sequelize.col('name')), 'userFullName'],
                  ],
                  raw: true,
               });

               await user.createReview({
                  tourId,
                  assessment,
                  text,
                  userFullName: userInformation.userFullName,
               });

               return {success: true};

            },

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