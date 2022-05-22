import {gql} from 'apollo-server-express';
import { Sequelize} from '../../models/index.js';
import { Op } from 'sequelize';

import models from '../../models';
import * as checkUserRights from '../../utils/checkUserRights.js';
import {ORDER_STATUSES, USER_ROLES} from '../../config/const.js';

export default class Order {

   static resolver() {
      return {

         OrdersWithAdditionalData: {

            managersInOrders: async () => {
               const distinctManagersInOrders = await models.Order.findAll({
                  attributes: [
                     [Sequelize.fn('DISTINCT', Sequelize.col('managerFullName')), 'managerFullName'],
                  ],
                  where: {
                     managerId: {[Sequelize.Op.ne]: null},
                  },
               });

               const managersInOrders = [];
               for (const manager of distinctManagersInOrders) managersInOrders.push(manager.managerFullName);

               return managersInOrders;
            },
            
            shopsInOrders: async () => {
               const distinctShopsInOrders = await models.Order.findAll({
                  attributes: [
                     [Sequelize.fn('DISTINCT', Sequelize.col('shopName')), 'shopName'],
                  ],
               });
      
               const shopsInOrders = [];
               for (const shop of distinctShopsInOrders) shopsInOrders.push(shop.shopName);

               return shopsInOrders;
            },

            clientsInOrders: async () => {
               const distinctClientsInOrders = await models.Order.findAll({
                  attributes: [
                     [Sequelize.fn('DISTINCT', Sequelize.col('clientFullName')), 'clientFullName'],
                  ],
               });
               
               const clientsInOrders = [];
               for (const client of distinctClientsInOrders) clientsInOrders.push(client.clientFullName);
               
               return clientsInOrders;
            },
            
            totalOrders: () => models.Order.count(),

         },


         Query: {

            getOrdersWithAdditionalData: async (parent, {input}, context) => {

               checkUserRights.checkRole(context, USER_ROLES.MANAGER);

               const {
                  limit, offset, dateFrom, dateUntil, manager, shop,
                  client, priceFrom, priceTo, paid, status, searchKey

               } = input;


               const orders = await models.Order.findAll({
                  limit,
                  offset,
                  where: {
                     ...(manager? {managerFullName: manager} : {}),
                     ...(shop? {shopName: shop} : {}),
                     ...(client? {clientFullName: client} : {}),
                     price: {
                        ...(priceFrom? {[Op.gte]: priceFrom} : {[Op.gte]: 0}),
                        ...(priceTo? {[Op.lte]: priceTo} : {}),
                     },
                     ...(paid? {paid}: {}),
                     ...(status? {status}: {}),
                     ...(searchKey? {[Op.or]: [
                        {managerFullName: {[Op.like]: `%${searchKey}%`}},
                        {shopName: {[Op.like]: `%${searchKey}%`}},
                        {clientFullName: {[Op.like]: `%${searchKey}%`}},
                        {price: {[Op.like]: `%${searchKey}%`}},
                     ]} : {}),
                  },
               });


               return {orders};

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
         shopName: String
         managerFullName: String
         clientFullName: String
         clientPhone: String
         price: Int
         paid: Boolean
         tourDate: String
         status: OrderStatus
         createdAt: String
      }

      type OrdersWithAdditionalData {
         orders: [Order]
         managersInOrders: [String]
         shopsInOrders: [String]
         clientsInOrders: [String]
         totalOrders: Int
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
         shop: String
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