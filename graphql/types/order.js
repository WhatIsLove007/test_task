import {gql} from 'apollo-server-express';
import { Sequelize} from '../../models/index.js';
import { Op } from 'sequelize';

import models from '../../models';
import * as checkUserRights from '../../utils/checkUserRights.js';
import {ORDER_STATUSES, USER_ROLES} from '../../config/const.js';

export default class Order {

   static resolver() {
      return {

         Query: {

            getOrders: async (parent, {input}, context) => {

               checkUserRights.checkRole(context, USER_ROLES.MANAGER);

               const {
                  limit, offset, dateFrom, dateUntil, manager, shopId,
                  client, priceFrom, priceTo, paid, status, searchKey
                  
               } = input;


               const orders = await models.Order.findAll({
                  limit,
                  offset,
                  where: {
                     ...(manager? {managerFullName: manager} : {}),
                     ...(shopId? {shopId} : {}),
                     ...(client? {clientFullName: client} : {}),
                     price: {
                        ...(priceFrom? {[Op.gte]: priceFrom} : {[Op.gte]: 0}),
                        ...(priceTo? {[Op.lte]: priceTo} : {}),
                     },
                     ...(paid? {paid}: {}),
                     ...(status? {status}: {}),
                     ...(searchKey? {[Op.or]: [
                        {managerFullName: {[Op.like]: `%${searchKey}%`}},
                        {clientFullName: {[Op.like]: `%${searchKey}%`}},
                        {price: {[Op.like]: `%${searchKey}%`}},
                     ]} : {}),
                     createdAt: {
                        ...(dateFrom? {[Op.gte]: dateFrom} : {}),
                        ...(dateUntil? {[Op.lte]: dateUntil} : {[Op.lte]: new Date()}),
                     }
                  },
               });

               return orders;

            },

            getDistinctManagersInOrders: async (parent, {}, context) => {

               checkUserRights.checkRole(context, USER_ROLES.MANAGER);

               const distinctManagersInOrders = await models.Order.findAll({
                  attributes: [
                     [Sequelize.fn('DISTINCT', Sequelize.col('managerFullName')), 'managerFullName'],
                  ],
                  where: {
                     managerFullName: {[Sequelize.Op.ne]: null},
                  },
               });

               return distinctManagersInOrders.map(manager => manager.managerFullName);
            },
            
            getDistinctShopsInOrders: async (parent, {}, context) => {

               checkUserRights.checkRole(context, USER_ROLES.MANAGER);

               const distinctShopsInOrders = await models.Order.findAll({
                  attributes: [
                     [Sequelize.fn('DISTINCT', Sequelize.col('shopId')), 'shopId'],
                  ],
               });
      
               return distinctShopsInOrders.map(shop => shop.getShop());
            },
   
            getDistinctClientsInOrders: async (parent, {}, context) => {

               checkUserRights.checkRole(context, USER_ROLES.MANAGER);

               const distinctClientsInOrders = await models.Order.findAll({
                  attributes: [
                     [Sequelize.fn('DISTINCT', Sequelize.col('clientFullName')), 'clientFullName'],
                  ],
               });

               return distinctClientsInOrders.map(client => client.clientFullName);
               
            },
            
            getTotalOrders: async (parent, {}, context) => {

               checkUserRights.checkRole(context, USER_ROLES.MANAGER);

               return models.Order.count()
            },
            
         },
      }
   }
   
   
   static typeDefs() {
      return gql`

      type Order {
         id: Int
         managerId: Int
         shopId: Int
         managerFullName: String
         clientFullName: String
         clientPhone: String
         price: Int
         paid: Boolean
         tourDate: String
         status: OrderStatus
         createdAt: String
      }

      enum OrderStatus {
         ${ORDER_STATUSES.IN_PROCESSING}
         ${ORDER_STATUSES.NEW}
         ${ORDER_STATUSES.DELIVERY}
         ${ORDER_STATUSES.CANCELED}
      }

      input OrderFilterInput {
         limit: Int!
         offset: Int!
         dateFrom: String
         dateUntil: String
         manager: String
         shopId: Int
         client: String
         priceFrom: Int
         priceTo: Int
         paid: Boolean
         status: OrderStatus
         searchKey: String
      }

      `
   }

}