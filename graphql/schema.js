import {_} from 'lodash';
import { gql } from 'apollo-server-express';

import User from './types/user.js';
import UserInformation from './types/userInformation.js';
import UserAddress from './types/userAddress.js';
import UserPreference from './types/userPreference';
import Photocard from './types/photocard';
import Country from './types/country.js';
import * as userAuthentication from '../utils/userAuthentication.js';
import { USER_STATUSES } from '../config/const.js';



export const typeDefs = gql`

  ${User.typeDefs()}
  ${UserInformation.typeDefs()}
  ${UserAddress.typeDefs()}
  ${UserPreference.typeDefs()}
  ${Photocard.typeDefs()}
  ${Country.typeDefs()}

  type LoginResponse {
    authorization: String!
  }

  type Response {
    success: Boolean!
  }

  scalar Upload


  type Query {
    signin(input: UserSigninInput): LoginResponse
    getUserProfile(photocardsLimit: Int, photocardsOffset: Int): UserProfile
  }


  type Mutation {
    signup(input: UserSignupInput, file: Upload): LoginResponse
    sendPasswordResetEmail(emailOrLogin: String!): SendPasswordResetEmail
    recoverPassword(token: String!, password: String!, repeatingPassword: String!): LoginResponse!
    deleteAccount: Response
    editUserProfile(input: UserProfileEditing): Response
    addUserAvatar(file: Upload): Response
    switchFavoritePhotocard(photocardId: Int!): Response
    switchUserPreference(preferenceName: String!): Response
  }
  
`;


function combineResolvers() {
  return _.merge(
    User.resolver(),
  )
}


export const resolvers = combineResolvers();


export const context = async context => {

  const authorization = context.req.headers.authorization;
  if (!authorization) {
    context.user = null;
    return context;
  }

  const user = await userAuthentication.authenticateToken(authorization);
  if (!user || user.status === USER_STATUSES.BANNED) {
    context.user = null;
    return context;
  }

  context.user = user;
  return context;
}