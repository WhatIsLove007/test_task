import express from 'express';
import {ApolloServer} from 'apollo-server-express';
import {graphqlUploadExpress} from 'graphql-upload';
import path from 'path';
import passport from 'passport';
import passportGoogleOauth2 from 'passport-google-oauth2';
import passportFacebook from 'passport-facebook';
import passportLinkedinOauth2 from 'passport-linkedin-oauth2';

import {typeDefs, resolvers, context} from './graphql/schema.js';
import * as userAuthentication from './utils/userAuthentication.js';
import {URL_CALLBACKS} from './config/const.js';
import {createUserViaGoogle, createUserViaFacebook, createUserViaLinkedin} from './utils/oauth.js';


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
  createUserViaGoogle,
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
  createUserViaFacebook,
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
createUserViaLinkedin,
));

app.get('/auth/linkedin', passport.authenticate("linkedin"));

app.get("/auth/linkedin/callback", passport.authenticate('linkedin', {session: false}), (req, res) => {
  const token = userAuthentication.generateAccessToken(req.user.id, req.user.login);
  return res.send({authorization: token, redirect : "/"});
});



app.listen(PORT, error => error? console.log(error) : console.log(`Server has been started on PORT ${PORT}...`));