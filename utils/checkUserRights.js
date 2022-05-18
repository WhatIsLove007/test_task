import {THROW_ERROR_MESSAGES} from '../config/const.js';



export const checkId = (context, id) => {

   if (context?.user?.id !== id) throw new Error(THROW_ERROR_MESSAGES.FORBIDDEN);

}

export const checkRole = (context, role) => {

   if (context?.user?.role !== role) {
      throw new Error(THROW_ERROR_MESSAGES.FORBIDDEN);
   }

}