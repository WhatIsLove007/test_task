import {gql} from 'apollo-server-express';

import models from '../../models';
import * as checkUserRights from '../../utils/checkUserRights.js'



export default class User {

   static resolver() {
      return {

         Query: {

            getPhotocards: async (parent, {}, context) => {

               checkUserRights.checkUserAuthentication(context);

               const url = context.req.protocol + '://' + context.req.get('host');

               const photocards = await models.Photocard.findAll();
               if (!photocards) throw new Error('NO PHOTOCARDS');
               
               photocards.forEach(element => element.urlPath = `${url}/photocards/${element.name}`);

               for (const photocard of photocards) {
               
                  const favoritePhotocard = await photocard.getFavoritePhotocards({
                     where: {userId: context.user.id},
                  });
                  
                  photocard.isFavoritePhotocard = favoritePhotocard.length? true : false;

                  photocard.urlPath = `${url}/storage/files/photocards/${photocard.name}`;
               
               }

               return photocards;

            },

         },

      }
   }


   static typeDefs() {
      return gql`

      type Photocard {
         id: Int
         name: String
         urlPath: String
         isFavoritePhotocard: Boolean
      }


      `
   }

}