import express, { response } from 'express';
import dotenv from 'dotenv/config';
import {ApolloServer} from 'apollo-server-express';
import {graphqlUploadExpress} from 'graphql-upload';
import path from 'path';
import passport from 'passport';
import passportGoogleOauth2 from 'passport-google-oauth2';
import passportFacebook from 'passport-facebook';
import passportLinkedinOauth2 from 'passport-linkedin-oauth2';
import fs from 'fs';
import fetch from 'node-fetch';

import {typeDefs, resolvers, context} from './graphql/schema.js';
import models from './models';
import * as uuid from './utils/uuid.js';
import {sequelize} from './models/index.js';
import * as userAuthentication from './utils/userAuthentication.js';
import {URL_CALLBACKS} from './config/const.js';


const app = express();
const PORT = process.env.PORT || 3000;
const GoogleStrategy = passportGoogleOauth2.Strategy;
const FacebookStrategy = passportFacebook.Strategy;
const LinkedinStrategy = passportLinkedinOauth2.Strategy;


async function startApolloServer() {

  const server = new ApolloServer({ typeDefs, resolvers, context});
  await server.start();
  app.use(graphqlUploadExpress());
  server.applyMiddleware({app});
  
}
startApolloServer();


app.use(express.json());


app.use('/storage/files/photocards', express.static(path.join(__dirname, '/uploads/photocards/')));
app.use('/storage/files/user/avatars', express.static(path.join(__dirname, '/uploads/user/avatars')));



passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: URL_CALLBACKS.GOOGLE_URL_CALLBACK,
  passReqToCallback : true,
},
  async (request, accessToken, refreshToken, profile, done) => {

    const existingUser = await models.User.findOne({where: {email: profile.email}});

    if (existingUser) {
      const userToken = await existingUser.getUserToken();

      if (userToken.googleId === profile.id) {

        return done(null, existingUser);

      } else {
        return done('EMAIL ALREADY REGISTERED WITHOUT GOOGLE OAUTH', false);
      }

    }
  
    const transaction = await sequelize.transaction();

    try {
      const newUser = await models.User.create({
        email: profile.email,
        login: uuid.generateUuid(),
      }, {transaction});


      await newUser.createUserInformation({
        name: profile.given_name,
        ...(profile.family_name? {surname: profile.family_name} : {}),
        ...(profile.picture? {avatar: `${newUser.id}.jpg`} : {}),
      }, {transaction});

      await newUser.createUserAddress({}, {transaction});

      await newUser.createUserToken({googleId: profile.id,}, {transaction});

      if (profile.picture) {
        const response = await fetch(profile.picture);
        const buffer = await response.buffer();
        fs.writeFileSync(__dirname + `/uploads/user/avatars/${newUser.id}.jpg`, buffer);
      }

      await transaction.commit();

      return done(null, newUser);
  
    } catch (error) {
      console.log(error);
      await transaction.rollback;
      return done(error, false);
    }

  }
));

app.get('/auth/google', passport.authenticate("google", {scope: ['email', 'profile']}));

app.get("/auth/google/callback", passport.authenticate('google', {session: false}), (req, res) => {

  const token = userAuthentication.generateAccessToken(req.user.id, req.user.login);
  return res.send({authorization: token, redirect : "/"}); // We need a frontender...
});

app.get("/", (request, response) => {
  return response.send("Welcome and sorry for that, now we don't have a frontender... =(");
});



passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: URL_CALLBACKS.FACEBOOK_URL_CALLBACK,
  profileFields: ['id', 'name', 'photos', 'email', 'gender'],
},
  async function(accessToken, refreshToken, profile, cb) {

    const existingUser = await models.User.findOne({where: {email: profile._json.email}});

    if (existingUser) {
      const userToken = await existingUser.getUserToken();

      if (userToken.facebookId === profile.id) {

        return cb(null, existingUser);

      } else {
        return cb('EMAIL ALREADY REGISTERED WITHOUT FACEBOOK OAUTH', false);
      }

    }
  
    const transaction = await sequelize.transaction();

    try {
      const newUser = await models.User.create({
        email: profile._json.email,
        login: uuid.generateUuid(),
      }, {transaction});


      await newUser.createUserInformation({
        name: profile._json.first_name,
        surname: profile._json.last_name,
        avatar: `${newUser.id}.jpg`,
      }, {transaction});

      await newUser.createUserAddress({}, {transaction});

      await newUser.createUserToken({
        facebookId: profile.id,
      }, {transaction});

      const response = await fetch(profile.photos[0].value);
      const buffer = await response.buffer();
      fs.writeFileSync(__dirname + `/uploads/user/avatars/${newUser.id}.jpg`, buffer);

      await transaction.commit();

      return cb(null, newUser);
  
    } catch (error) {
      console.log(error);
      await transaction.rollback;
      return cb(error, false);
    }

  }
));

app.get('/auth/facebook', passport.authenticate('facebook', {session: false}));

app.get('/auth/facebook/callback', passport.authenticate('facebook', 
  {session: false, failureRedirect: '/login'}), (request, response) => {

  const token = userAuthentication.generateAccessToken(request.user.id, request.user.login);
  return response.send({authorization: token, redirect : "/"});
});



passport.use(new LinkedinStrategy({
  clientID: process.env.LINKEDIN_CLIENT_ID,
  clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
  callbackURL: URL_CALLBACKS.LINKEDIN_URL_CALLBACK,
  scope: ['r_emailaddress', 'r_liteprofile'],
},
  async (accessToken, refreshToken, profile, done) => {

    const existingUser = await models.User.findOne({where: {email: profile.emails[0].value}});

    if (existingUser) {

      const userToken = await existingUser.getUserToken();

      if (userToken.linkedinId === profile.id) {

        return done(null, existingUser);

      } else {
        return done('EMAIL ALREADY REGISTERED WITHOUT LINKEDIN OAUTH', false);
      }

    }
  
    const transaction = await sequelize.transaction();

    try {
      const newUser = await models.User.create({
        email: profile.emails[0].value,
        login: uuid.generateUuid(),
      }, {transaction});


      await newUser.createUserInformation({
        name: profile.name.givenName,
        surname: profile.name.familyName,
        ...(profile.photos[3].value? {avatar: `${newUser.id}.jpg`} : {}),
      }, {transaction});

      await newUser.createUserAddress({}, {transaction});

      await newUser.createUserToken({
        linkedinId: profile.id,
      }, {transaction});

      if (profile.photos[3].value) {
        const response = await fetch(profile.photos[3].value);
        const buffer = await response.buffer();
        fs.writeFileSync(__dirname + `/uploads/user/avatars/${newUser.id}.jpg`, buffer);
      }

      await transaction.commit();

      return done(null, newUser);
  
    } catch (error) {
      console.log(error);
      await transaction.rollback;
      return done(error, false);
    }

  }
));

app.get('/auth/linkedin', passport.authenticate("linkedin"));

app.get("/auth/linkedin/callback", passport.authenticate('linkedin', {session: false}), (req, res) => {
  const token = userAuthentication.generateAccessToken(req.user.id, req.user.login);
  return res.send({authorization: token, redirect : "/"});
});




app.listen(PORT, error => error? console.log(error) : console.log(`Server has been started on PORT ${PORT}...`));