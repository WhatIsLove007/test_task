import {_} from 'lodash';
import { gql } from 'apollo-server-express';

import User from './types/user.js';



export const typeDefs = gql`

  ${User.typeDefs()}


  type Query {
    getUser(id: Int): User
  }


  type Mutation {
    signupFirstStep(input: SignupFirstStepInput): User
    signupSecondStep(input: SignupSecondStepInput): User
  }

`;


function combineResolvers() {
  return _.merge(
    User.resolver(),
  )
}


export const resolvers = combineResolvers();