import { createServer } from "http";
import express from "express";
import { ApolloServer, gql } from "apollo-server-express";
import * as dotenv from 'dotenv'
dotenv.config()

import PwnSource from "./pwn_source";
import PsswrdSource from "./psswrd_source";

const startServer = async () => {

  const app = express()
  const httpServer = createServer(app)

  const typeDefs = gql`
    type Query {
      hello: String,
      # enter an email address to check if it has been breached
      breachedAccount(email: String!, includeUnverified: Boolean, domain: String): [Breach]
      # enter a domain to search for breaches that have occurred on that domain
      breaches(domain: String): [Breach]
      # enter a breach name to get details about that breach
      breach(name: String!): Breach
      # enter an email address to check if it has been used in a paste
      pasteAccount(email: String!): [Paste]
      # enter the first 5 characters of a SHA-1 password hash (not case-sensitive) to check if the password has been pwned
      pwnedPasswords(passwordHashFirstFiveChar: String!): String
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
      IsMalware: Boolean
    },
    type Paste {
      Id: String
      Source: String
      Title: String
      Date: String
      EmailCount: Int
    }
  `;

  const resolvers = {
    Query: {
      hello: () => 'Hello world!',
      breachedAccount: async (_: any, { email, includeUnverified, domain }: any, { dataSources }: any) => dataSources.pwns.getBreachedAccount(email, includeUnverified, domain),
      breaches: async (_: any, { domain }: any, { dataSources }: any) => dataSources.pwns.getBreaches(domain),
      breach: async (_: any, { name }: any, { dataSources }: any) => dataSources.pwns.getBreach(name),
      pasteAccount: async (_: any, { email }: any, { dataSources }: any) => dataSources.pwns.getPasteAccount(email),
      pwnedPasswords: async (_: any, { passwordHashFirstFiveChar }: any, { dataSources }: any) => dataSources.psswrds.getPwnedPasswords(passwordHashFirstFiveChar)
    },
  };

  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: () => ({ pwns: new PwnSource(), psswrds: new PsswrdSource() }),
  })

  await apolloServer.start()

  apolloServer.applyMiddleware({
    app,
    path: '/breaches'
  })

  httpServer.listen(process.env.PORT, () => {
    console.log('...and we have liftoff!')
    console.log(`🚀 🚀 🚀 Server is running at http://localhost:${process.env.PORT}${apolloServer.graphqlPath} 🚀 🚀 🚀`);
  });

}

startServer()