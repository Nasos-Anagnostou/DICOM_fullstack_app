// backend/server.js
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const sequelize = require('./models');
const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');
require('dotenv').config();

const app = express();

// GraphQL Server Setup
const server = new ApolloServer({ typeDefs, resolvers });
server.start().then(() => {
    server.applyMiddleware({ app });

    // Database Sync
    sequelize.sync().then(() => {
        app.listen(4000, () => {
            console.log('Server running at http://localhost:4000/graphql');
        });
    });
});