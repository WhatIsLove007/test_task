import {gql} from 'apollo-server-express';

import models from '../../models';
import * as checkUserRights from '../../utils/checkUserRights.js'



export default class Photocard {

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