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

// To allow cross origin request on this server(CORS-security mechanism build in the modern browsers) - to allow client to make a request to a different server ( by deafault its not allowed and client can only sent requests to the same host and port)
app.use((req, res, next) => {
  //give access to any client (* - any host can sent requests)
  res.setHeader('Access-Control-Allow-Origin', '*');
  //browser by default sent first options request before send post request (to look if post request allowed by the server)
  res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

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
