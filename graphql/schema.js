import {_} from 'lodash';
import { gql } from 'apollo-server-express';

import User from './types/user.js';
import UserInformation from './types/userInformation.js';
import Photocard from './types/photocard';
import * as userAuthentication from '../utils/userAuthentication.js';
import { USER_STATUSES } from '../config/const.js';



export const typeDefs = gql`

  ${User.typeDefs()}
  ${UserInformation.typeDefs()}
  ${Photocard.typeDefs()}

  type LoginResponse {
    authorization: String!
  }

  type Response {
    success: Boolean!
  }

  scalar Upload


  type Query {
    signin(input: UserSigninInput): LoginResponse
    getPhotocards: [Photocard]
  }


  type Mutation {
    signup(input: UserSignupInput, file: Upload): LoginResponse
    sendPasswordResetEmail(emailOrLogin: String!): SendPasswordResetEmail
    recoverPassword(token: String!, password: String!, repeatingPassword: String!): LoginResponse!
    deleteAccount: Response
    switchFavoritePhotocard(photocardId: Int!): Response
  }
  
`;


function combineResolvers() {
  return _.merge(
    User.resolver(),
    UserInformation.resolver(),
    Photocard.resolver(),
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