const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');
const sequelize = require('./config/database');

const app = express();
const server = new ApolloServer({ typeDefs, resolvers });

async function startServer() {
    await server.start();
    server.applyMiddleware({ app });

    sequelize.sync().then(() => {
        console.log("Database connected.");
        app.listen(4000, () => {
            console.log('Server running on http://localhost:4000/graphql');
        });
    });
}

startServer();
