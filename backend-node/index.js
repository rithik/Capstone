const express = require('express');
const {
    ApolloServer,
    gql
} = require('apollo-server-express');
const http = require("http");
var cors = require("cors");

const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({
        req, connection
    }) => {
        if (connection){
            return connection.context;
        }
        const token = req.headers.authorization || '';
        return {
            token
        };
    },
    subscriptions: {
        onConnect: (
            connectionParams,
            webSocket,
            connectionContext,
        ) => {
            console.log('websocket connect');
            if (connectionParams.Authorization) {
                return {
                    token: connectionParams.Authorization
                };
            }

            throw new Error('Missing auth token!');
        },
        onDisconnect: (webSocket, connectionContext) => {
            console.log('websocket disconnect');
        },
    },
    uploads: {
        maxFieldSize: 1000000, //bytes = 50MB
        maxFileSize: 1000000,
        maxFiles: 10
    }
});

const app = express();
app.use(cors());

server.applyMiddleware({
    app, 
    bodyParserConfig: {
        limit: '1mb',
    },
    route: {
        payload: {
            maxBytes: 1000000,
        },
    },
});

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

httpServer.listen(process.env.PORT || 4000, () => {
    console.log(`🚀 Server ready at http://localhost:${4000}${server.graphqlPath}`)
    console.log(`🚀 Subscriptions ready at ws://localhost:${4000}${server.subscriptionsPath}`)
});
