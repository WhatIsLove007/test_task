import express, { response } from 'express';
import dotenv from 'dotenv/config';
import {ApolloServer} from 'apollo-server-express';
import {graphqlUploadExpress} from 'graphql-upload';
import path from 'path';
import passport from 'passport';
import passportGoogleOauth2 from 'passport-google-oauth2';
import passportFacebook from 'passport-facebook';
import fs from 'fs';
import fetch from 'node-fetch';

import {typeDefs, resolvers, context} from './graphql/schema.js';
import models from './models';
import * as generateData from './utils/generateData.js';
import {sequelize} from './models/index.js';
import * as userAuthentication from './utils/userAuthentication.js';
import * as passwordHasing from './utils/passwordHashing.js';


const app = express();
const PORT = process.env.PORT || 3000;
const GoogleStrategy = passportGoogleOauth2.Strategy;
const FacebookStrategy = passportFacebook.Strategy;


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

// =============== GOOGLE ==============

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:3000/auth/google/callback',
  passReqToCallback : true,
},
  async (request, accessToken, refreshToken, profile, done) => {

    const existingUser = await models.User.findOne({where: {email: profile.email}});

    if (existingUser) {
      const userToken = await existingUser.getUserToken();

      if ( userToken.hashedGoogleId && passwordHasing.compare(profile.id, userToken.hashedGoogleId) ) {

        return done(null, existingUser);

      } else {
        return done('EMAIL ALREADY REGISTERED WITHOUT GOOGLE OAUTH', false);
      }

    }
  
    const transaction = await sequelize.transaction();

    try {
      const newUser = await models.User.create({
        email: profile.email,
        login: await generateData.generateUserLoginByEmail(profile.email),
      }, {transaction});


      await newUser.createUserInformation({
        name: profile.given_name,
        ...(profile.family_name? {surname: profile.family_name} : {}),
        ...(profile.picture? {avatar: `${newUser.id}.jpg`} : {}),
      }, {transaction});

      await newUser.createUserAddress({}, {transaction});

      await newUser.createUserToken({
        hashedGoogleId: await passwordHasing.hash(profile.id),
      }, {transaction});

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


// =============== FACEBOOK ==============

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: "http://localhost:3000/auth/facebook/callback",
  profileFields: ['id', 'name', 'photos', 'email', 'gender'],
},
  async function(accessToken, refreshToken, profile, cb) {

    const existingUser = await models.User.findOne({where: {email: profile._json.email}});

    if (existingUser) {
      const userToken = await existingUser.getUserToken();

      if ( userToken.hashedFacebookId && passwordHasing.compare(profile.id, userToken.hashedFacebookId) ) {

        return cb(null, existingUser);

      } else {
        return cb('EMAIL ALREADY REGISTERED WITHOUT FACEBOOK OAUTH', false);
      }

    }
  
    const transaction = await sequelize.transaction();

    try {
      const newUser = await models.User.create({
        email: profile._json.email,
        login: await generateData.generateUserLoginByEmail(profile._json.email),
      }, {transaction});


      await newUser.createUserInformation({
        name: profile._json.first_name,
        surname: profile._json.last_name,
        avatar: `${newUser.id}.jpg`,
      }, {transaction});

      await newUser.createUserAddress({}, {transaction});

      await newUser.createUserToken({
        hashedFacebookId: await passwordHasing.hash(profile.id),
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

app.get('/auth/facebook/callback', passport.authenticate('facebook', {session: false, failureRedirect: '/login'}), (req, res) => {
  const token = userAuthentication.generateAccessToken(req.user.id, req.user.login);
  return res.send({authorization: token, redirect : "/"});
});




app.listen(PORT, error => error? console.log(error) : console.log(`Server has been started on PORT ${PORT}...`));