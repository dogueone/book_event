const express = require('express');
const connectDB = require('./config/db');
const graphqlHttp = require('express-graphql');
const isAuth = require('./middleware/is-auth');

const app = express();

const graphQlSchema = require('./graphql/schema/index');
const graphQlResolvers = require('./graphql/resolvers/index');

// Connect Database
connectDB();

// Init Middleware to get the data in req.body
app.use(express.json({ extended: false }));

//Auth Middleware
app.use(isAuth);

app.use(
  '/graphql',
  graphqlHttp({
    schema: graphQlSchema,
    // rootValue - bundle of all the resolvers we have (logic to act on incoming requests)
    rootValue: graphQlResolvers,
    graphiql: true
  })
);

app.get('/', (req, res) => res.send('API Running'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
