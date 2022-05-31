import {gql} from 'apollo-server-express';

import models, { Sequelize } from '../../models';


export default class Discount {

   static resolver() {
      return {

         Mutation: {

            setDiscountForSubscribers: async (parent, {email}) => {

               const existingEmail = await models.Discount.findOne({where: {email}});
               if (existingEmail) throw new Error('THIS EMAIL ALREADY HAS A DISCOUNT');

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