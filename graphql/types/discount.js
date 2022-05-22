import {gql} from 'apollo-server-express';

import models, { Sequelize } from '../../models';


export default class Discount {

   static resolver() {
      return {

         Mutation: {

            setDiscountForSubscribers: async (parent, {email}) => {

               await models.Discount.create({
                  email,
                  amountOfDiscount: 25,
               });

               return {success: true}

            },

         },
      }
   }

}