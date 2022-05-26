export const USER_STATUSES = {
   ACTIVE: 'ACTIVE',
   BANNED: 'BANNED'
};

export const USER_ROLES = {
   CLIENT: 'CLIENT',
   MANAGER: 'MANAGER',
}

export const USER_GENDERS = {
   MALE: 'MALE',
   FEMALE: 'FEMALE',
};

export const ORDER_STATUSES = {
   IN_PROCESSING: 'IN_PROCESSING',
   NEW: 'NEW',
   DELIVERY: 'DELIVERY',
   CANCELED: 'CANCELED',
};

export const ERROR_MESSAGES = {
   FORBIDDEN: 'FORBIDDEN',
   UNAUTHORIZED: 'UNAUTHORIZED',
   NO_ACCESS_RIGHTS: 'NO ACCESS RIGHTS',
   USER_NOT_FOUND: 'USER NOT FOUND',
   COUNTRY_NOT_FOUND: 'COUNTRY_NOT_FOUND',
   TOUR_NOT_FOUND: 'TOUR_NOT_FOUND',
   LOGIN_ALREADY_EXISTS: 'LOGIN ALREADY EXISTS',
   EMAIL_ALREADY_EXISTS: 'EMAIL ALREADY EXISTS',
}

export const AUTHORIZATION_ACCESS_SECRET_KEY = process.env.ACCESS_SECRET_KEY;

export const URL_CALLBACKS = {
   ...(process.env.NODE_ENV === 'development'? {
      GOOGLE_URL_CALLBACK: 'http://localhost:3000/auth/google/callback',
      FACEBOOK_URL_CALLBACK: 'http://localhost:3000/auth/facebook/callback',
      LINKEDIN_URL_CALLBACK: 'http://localhost:3000/auth/linkedin/callback',
   } : {}),

}

export const USER_PROFILE_COMPLETENESS = {
   AVATAR: 25,
   PROFILE_HEADER: 25,
   ABOUT: 25,
   USER_PREFERENCE: 25,
}