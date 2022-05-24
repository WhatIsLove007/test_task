import models from '../models';


export const generateUserLoginByEmail = async (email, recursiveLogin) => {
   
   const login = email? email.split('@')[0] : null;

   if (recursiveLogin) recursiveLogin += Math.floor(Math.random() * 10);

   const existingLogin = await models.User.findOne({
      where: {
         ...(login? {login} : {login: recursiveLogin}),
      }
   });

   if (existingLogin) {
      return generateUserLoginByEmail(null, login? login : recursiveLogin);
   } else {

      return login? login : recursiveLogin;
   }


}