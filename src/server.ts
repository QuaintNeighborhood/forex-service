import http from 'http';
import dotenv from 'dotenv';
import express, { Express } from 'express';
import morgan from 'morgan';
import routes from './routes/forex';
import { setInterval } from 'timers';
import { ApolloServer, gql } from 'apollo-server-express';
import { getForexApollo } from './controllers/forex';
import { refreshCache } from './dao/fixer';

// load the environment variables from the .env file
dotenv.config({
  path: '.env'
});

const app: Express = express();

/** Logging */
app.use(morgan('dev'));

/** RULES OF OUR API */
app.use((req, res, next) => {
  // set the CORS policy
  res.header('Access-Control-Allow-Origin', '*');
  // set the CORS headers
  res.header('Access-Control-Allow-Headers', 'origin, X-Requested-With,Content-Type,Accept, Authorization');
  next();
});

/** Routes */
app.use('/', routes);

const server = new ApolloServer({
  typeDefs: gql`
    type Query {
      rate(base: String!, symbol: String!): Float
    }
  `,
  resolvers: {
    Query: {
      rate: getForexApollo
    }
  },
  csrfPrevention: true
});

server.start().then(res => {
  server.applyMiddleware({ app });
  const ONE_HOUR_IN_MS: number = 3600000;
  const httpServer: http.Server = http.createServer(app);
  const PORT: any = process.env.APP_PORT ?? 5000;
  httpServer.listen(PORT, () => {
    console.log(`The server is running on port ${PORT}`);
    console.log(`gql path is ${server.graphqlPath}`);
    setInterval(() => {
      console.log('Refreshing cache every 1 hour');
      refreshCache();
    }, ONE_HOUR_IN_MS);
  });
});
