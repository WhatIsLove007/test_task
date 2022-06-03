module.exports = {
   USER_STATUSES: {
      ACTIVE: 'ACTIVE',
      BANNED: 'BANNED'
   },
   
   USER_ROLES: {
      CLIENT: 'CLIENT',
      MANAGER: 'MANAGER',
   },
   
   USER_GENDERS: {
      MALE: 'MALE',
      FEMALE: 'FEMALE',
   },
   
   ORDER_STATUSES: {
      IN_PROCESSING: 'IN_PROCESSING',
      NEW: 'NEW',
      DELIVERY: 'DELIVERY',
      CANCELED: 'CANCELED',
   },
   
   ERROR_MESSAGES: {
      FORBIDDEN: 'FORBIDDEN',
      UNAUTHORIZED: 'UNAUTHORIZED',
      NO_ACCESS_RIGHTS: 'NO ACCESS RIGHTS',
      USER_NOT_FOUND: 'USER NOT FOUND',
      COUNTRY_NOT_FOUND: 'COUNTRY_NOT_FOUND',
      TOUR_NOT_FOUND: 'TOUR_NOT_FOUND',
      LOGIN_ALREADY_EXISTS: 'LOGIN ALREADY EXISTS',
      EMAIL_ALREADY_EXISTS: 'EMAIL ALREADY EXISTS',
      NO_FILE: 'No file',
   },
   
   AUTHORIZATION_ACCESS_SECRET_KEY: process.env.ACCESS_SECRET_KEY,
   
   USER_PROFILE_COMPLETENESS: {
      AVATAR: 25,
      PROFILE_HEADER: 25,
      ABOUT: 25,
      USER_PREFERENCE: 25,
   },

   OAUTH_ERROR_MESSAGES: {
      ALREADY_REGISTERED_WITHOUT_GOOGLE: 'EMAIL ALREADY REGISTERED WITHOUT GOOGLE OAUTH',
      ALREADY_REGISTERED_WITHOUT_FACEBOOK: 'EMAIL ALREADY REGISTERED WITHOUT FACEBOOK OAUTH',
      ALREADY_REGISTERED_WITHOUT_LINKEDIN: 'EMAIL ALREADY REGISTERED WITHOUT LINKEDIN OAUTH',

   },

   TOKEN_LIFETIME: {
      THREE_DAYS: 259200000,
   },

   DEFAULT_FILTERING_VALUES: {
      PHOTOCARDS_LIMIT: 10,
   },
}
