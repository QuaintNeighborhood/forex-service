"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const forex_1 = __importDefault(require("./routes/forex"));
const timers_1 = require("timers");
const apollo_server_express_1 = require("apollo-server-express");
const forex_2 = require("./controllers/forex");
const fixer_1 = require("./dao/fixer");
// load the environment variables from the .env file
dotenv_1.default.config({
    path: '.env'
});
const app = (0, express_1.default)();
/** Logging */
app.use((0, morgan_1.default)('dev'));
/** RULES OF OUR API */
app.use((req, res, next) => {
    // set the CORS policy
    res.header('Access-Control-Allow-Origin', '*');
    // set the CORS headers
    res.header('Access-Control-Allow-Headers', 'origin, X-Requested-With,Content-Type,Accept, Authorization');
    next();
});
/** Routes */
app.use('/', forex_1.default);
const server = new apollo_server_express_1.ApolloServer({
    typeDefs: (0, apollo_server_express_1.gql) `
    type Query {
      rate(base: String!, symbol: String!): Float
    }
  `,
    resolvers: {
        Query: {
            rate: forex_2.getForexApollo
        }
    },
    csrfPrevention: true
});
server.start().then(res => {
    var _a;
    server.applyMiddleware({ app });
    const ONE_HOUR_IN_MS = 3600000;
    const httpServer = http_1.default.createServer(app);
    const PORT = (_a = process.env.APP_PORT) !== null && _a !== void 0 ? _a : 5000;
    httpServer.listen(PORT, () => {
        console.log(`The server is running on port ${PORT}`);
        console.log(`gql path is ${server.graphqlPath}`);
        (0, timers_1.setInterval)(() => {
            console.log('Refreshing cache every 1 hour');
            (0, fixer_1.refreshCache)();
        }, ONE_HOUR_IN_MS);
    });
});
