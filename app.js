import express from 'express';
import dotenv from 'dotenv/config';
import { ApolloServer } from 'apollo-server-express';
import {graphqlUploadExpress} from 'graphql-upload';
import path from 'path';

import {typeDefs, resolvers, context} from './graphql/schema.js';

const app = express();
const PORT = process.env.PORT || 3000;


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


  
app.listen(PORT, error => error? console.log(error) : console.log(`Server has been started on PORT ${PORT}...`));