import express from 'express';
import dotenv from 'dotenv/config';
import { ApolloServer } from 'apollo-server-express';

import {typeDefs, resolvers} from './graphql/schema.js';

const app = express();
const PORT = process.env.PORT || 3000;


async function startApolloServer() {

  const server = new ApolloServer({ typeDefs, resolvers});
  await server.start();
  server.applyMiddleware({app});
  
}
startApolloServer();


app.use(express.json());

  
app.listen(PORT, error => error? console.log(error) : console.log(`Server has been started on PORT ${PORT}...`));