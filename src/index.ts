import { createServer } from "http";
import express from "express";
import { ApolloServer, gql } from "apollo-server-express";
import * as dotenv from 'dotenv'
dotenv.config()

import Breaches from "./breach_source";

const startServer = async () => {

  const app = express()
  const httpServer = createServer(app)

  const typeDefs = gql`
    type Query {
      hello: String,
      breaches(email: String): [Breach]
    },
    type Breach {
      Name: String
      Title: String
      Domain: String
      BreachDate: String
      AddedDate: String
      ModifiedDate: String
      PwnCount: Int
      Description: String
      LogoPath: String
      DataClasses: [String]
      IsVerified: Boolean
      IsFabricated: Boolean
      IsSensitive: Boolean
      IsRetired: Boolean
      IsSpamList: Boolean
    },
    type Paste {
      Source: String
      Id: String
      Title: String
      Date: String
      EmailCount: Int
    }
  `;

  const resolvers = {
    Query: {
      hello: () => 'Hello world!',
      breaches: async (_: any, { email }: any, { dataSources }: any) => dataSources.breaches.getBreaches(email)
    },
  };

  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: () => ({ breaches: new Breaches() }),
  })

  await apolloServer.start()

  apolloServer.applyMiddleware({
    app,
    path: '/api'
  })

  httpServer.listen(process.env.PORT, () => {
    console.log('...and we have liftoff!')
    console.log(`🚀 🚀 🚀 Server is running at http://localhost:${process.env.PORT || 4000}${apolloServer.graphqlPath} 🚀 🚀 🚀`);
  });

}

startServer()