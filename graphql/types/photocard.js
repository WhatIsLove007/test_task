import {gql} from 'apollo-server-express';

import models from '../../models';
import * as checkUserRights from '../../utils/checkUserRights.js'

export default class Photocard {

   static resolver() {
      return {

         Mutation: {
            switchFavoritePhotocard: async (parent, {photocardId}, context) => {
               checkUserRights.checkUserAuthentication(context);

               const userId = context.user.id;

               const photocard = await models.Photocard.findByPk(photocardId);
               if (!photocard) throw new Error('PHOTOCARD NOT FOUND');
   
               const favoritePhotocard = await models.FavoritePhotocard.findOne({
                  where: {userId, photocardId},
               });

               let action;

               if (!favoritePhotocard) {
                  await photocard.createFavoritePhotocard({userId});
                  action = 'ADDED';
               } else {
                  await favoritePhotocard.destroy();
                  action = 'DELETED';
               }

               const url = context.req.protocol + '://' + context.req.get('host');
               photocard.urlPath = `${url}/storage/files/photocards/${photocard.fileName}`;

               return {photocard, action};
            },
         },
      }
   }

   static typeDefs() {
      return gql`
         type Photocard {
            id: Int
            fileName: String
            urlPath: String
         }
      `
   }

}