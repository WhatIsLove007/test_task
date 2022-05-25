import validator from 'validator';


export const validateEmail = email => validator.isEmail(email);

export const validateLogin = login => /^[a-zA-Z0-9][a-zA-Z0-9-_]{5,36}$/.test(login);

export const validatePassword = password => /^[a-zA-Z0-9_]{4,16}$/.test(password);

export const isImage = mimetype => {
   if (mimetype !== 'image/jpeg' && mimetype !== 'image/png') {
      throw new Error('Incorrect file');
   }
}

export const checkFilledFields = fields => {

   fields.forEach(field => {
      if (!field) {
         throw new Error('NOT ALL FIELDS ARE FILLED');
      };
   });
}