import {_} from 'lodash';
import { gql } from 'apollo-server-express';

import User from './types/user.js';
import UserInformation from './types/userInformation.js';
import UserAddress from './types/userAddress.js';
import UserPreference from './types/userPreference';
import Photocard from './types/photocard';
import Country from './types/country.js';
import Order from './types/order.js';
import Review from './types/review.js';
import Discount from './types/discount.js';
import Tour from './types/tour.js';
import * as userAuthentication from '../utils/userAuthentication.js';
import { USER_STATUSES } from '../config/const.js';



export const typeDefs = gql`

  ${User.typeDefs()}
  ${UserInformation.typeDefs()}
  ${UserAddress.typeDefs()}
  ${UserPreference.typeDefs()}
  ${Photocard.typeDefs()}
  ${Country.typeDefs()}
  ${Order.typeDefs()}
  ${Review.typeDefs()}
  ${Tour.typeDefs()}

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
    getOrdersWithAdditionalData(input: OrderFilterInput!): OrdersWithAdditionalData
    getTourBookingPage: TourBookingPage
    getCountries: [Country]
  }


  type Mutation {
    signup(input: UserSignupInput, file: Upload): LoginResponse
    sendPasswordResetEmail(emailOrLogin: String!): SendPasswordResetEmail
    recoverPassword(token: String!, password: String!, repeatingPassword: String!): LoginResponse!
    deleteAccount: Response
    editUserProfile(input: UserProfileEditingInput): UserProfileEditing
    addUserAvatar(file: Upload): Response
    switchFavoritePhotocard(photocardId: Int!): SwitchFavoritePhotocard
    switchUserPreference(preferenceName: String!): SwitchUserPreference
    bookTour(input: BookTourInput): Response
    acceptClientOrder(orderId: Int!): Response
    addReview(tourId: Int!, assessment: Int!, text: String!): Response
    setDiscountForSubscribers(email: String!): Response
  }
  
`;


function combineResolvers() {
  return _.merge(
    User.resolver(),
    Order.resolver(),
    Review.resolver(),
    Discount.resolver(),
    Tour.resolver(),
    Country.resolver(),
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