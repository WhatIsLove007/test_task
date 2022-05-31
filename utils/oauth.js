import fetch from 'node-fetch';
import fs from 'fs';
import mime from 'mime';
import path from 'path';

import models from '../models';
import { sequelize } from '../models/index.js';
import * as uuid from '../utils/uuid.js';
import { OAUTH_ERROR_MESSAGES } from '../config/const.js';


export const createUserViaGoogle = async (request, accessToken, refreshToken, profile, done) => {

   const existingUser = await models.User.findOne({where: {email: profile.email}});

   if (existingUser) {
      const userToken = await existingUser.getUserToken();

      if (userToken.googleId === profile.id) {

         return done(null, existingUser);

      } else {
         return done(OAUTH_ERROR_MESSAGES.ALREADY_REGISTERED_WITHOUT_GOOGLE, false);
      }

   }
 
   const transaction = await sequelize.transaction();

   try {
      const newUser = await models.User.create({
         email: profile.email,
         login: uuid.generateUuid(),
      }, {transaction});
     
      let newUserAvatarName;
      if (profile.picture) {
         const responseFromGoogleusercontent = await fetch(profile.picture);
         const buffer = await responseFromGoogleusercontent.buffer();
         const imageMimetype = responseFromGoogleusercontent.headers.get('content-type');
         newUserAvatarName = `${newUser.id}.${mime.extension(imageMimetype)}`;  
         fs.writeFileSync(path.join(__dirname, `../uploads/user/avatars/${newUserAvatarName}`), buffer);
      }
     
      await newUser.createUserInformation({
         firstName: profile.given_name,
         ...(profile.family_name? {lastName: profile.family_name} : {}),
         ...(profile.picture? {avatar: newUserAvatarName} : {}),
      }, {transaction});

      await newUser.createUserAddress({}, {transaction});

      await newUser.createUserToken({googleId: profile.id,}, {transaction});

      await transaction.commit();

      return done(null, newUser);
 
   } catch (error) {
      console.log(error);
      await transaction.rollback;
      return done(error, false);
   }
}


export const createUserViaFacebook = async (accessToken, refreshToken, profile, cb) => {

   const existingUser = await models.User.findOne({where: {email: profile._json.email}});

   if (existingUser) {
      const userToken = await existingUser.getUserToken();

      if (userToken.facebookId === profile.id) {

         return cb(null, existingUser);

      } else {
         return cb(OAUTH_ERROR_MESSAGES.ALREADY_REGISTERED_WITHOUT_FACEBOOK, false);
      }

   }
 
   const transaction = await sequelize.transaction();

   try {
      const newUser = await models.User.create({
         email: profile._json.email,
         login: uuid.generateUuid(),
      }, {transaction});
     
      const responseFromPlatformLookaside = await fetch(profile.photos[0].value);
      const buffer = await responseFromPlatformLookaside.buffer();
      const imageMimetype = responseFromPlatformLookaside.headers.get('content-type');
      const newUserAvatarName = `${newUser.id}.${mime.extension(imageMimetype)}`;
      fs.writeFileSync(path.join(__dirname, `../uploads/user/avatars/${newUserAvatarName}`), buffer);

      await newUser.createUserInformation({
         firstName: profile._json.first_name,
         lastName: profile._json.last_name,
         avatar: newUserAvatarName,
      }, {transaction});

      await newUser.createUserAddress({}, {transaction});

      await newUser.createUserToken({
         facebookId: profile.id,
      }, {transaction});

      await transaction.commit();

      return cb(null, newUser);
 
   } catch (error) {
      console.log(error);
      await transaction.rollback;
      return cb(error, false);
   }
}


export const createUserViaLinkedin = async (accessToken, refreshToken, profile, done) => {

   const existingUser = await models.User.findOne({where: {email: profile.emails[0].value}});

   if (existingUser) {

      const userToken = await existingUser.getUserToken();

      if (userToken.linkedinId === profile.id) {

         return done(null, existingUser);

      } else {
         return done(OAUTH_ERROR_MESSAGES.ALREADY_REGISTERED_WITHOUT_LINKEDIN, false);
      }

   }
 
   const transaction = await sequelize.transaction();

   try {
      const newUser = await models.User.create({
         email: profile.emails[0].value,
         login: uuid.generateUuid(),
      }, {transaction});
      
      let newUserAvatarName;
      if (profile.photos[3].value) {
         const responseFromMediaExp1 = await fetch(profile.photos[3].value);
         const buffer = await responseFromMediaExp1.buffer();
         const imageMimetype = responseFromMediaExp1.headers.get('content-type');
         newUserAvatarName = `${newUser.id}.${mime.extension(imageMimetype)}`;  
         fs.writeFileSync(path.join(__dirname, `../uploads/user/avatars/${newUserAvatarName}`), buffer);
      }

      await newUser.createUserInformation({
         firstName: profile.name.givenName,
         lastName: profile.name.familyName,
         ...(profile.photos[3].value? {avatar: newUserAvatarName} : {}),
      }, {transaction});

      await newUser.createUserAddress({}, {transaction});

      await newUser.createUserToken({
         linkedinId: profile.id,
      }, {transaction});

      await transaction.commit();

      return done(null, newUser);
 
   } catch (error) {
      console.log(error);
      await transaction.rollback;
      return done(error, false);
   }
 }
