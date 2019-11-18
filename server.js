const express = require('express');
const connectDB = require('./config/db');
const graphqlHttp = require('express-graphql');

const app = express();

const graphQlSchema = require('./graphql/schema/index');
const graphQlResolvers = require('./graphql/resolvers/index');

// Connect Database
connectDB();

// Init Middleware to get the data in req.body
app.use(express.json({ extended: false }));

// Manual population (deep population)
// These functions are not executed as long as we dont request that specific property(value) => its not infinite loop
const user = userId => {
  return User.findById(userId)
    .then(user => {
      return {
        ...user._doc,
        createdEvents: events.bind(this, user._doc.createdEvents)
      };
    })
    .catch(err => {
      throw err;
    });
};

// Manual population; to get all events where id of the event is one of the ids in array
// we call a function (user) to access creator properties (GraphQL parses values that a functions and return value)
const events = eventIds => {
  return Event.find({ _id: { $in: eventIds } })
    .then(events => {
      return events.map(event => {
        return { ...event._doc, creator: user.bind(this, event.creator) };
      });
    })
    .catch(err => {
      throw err;
    });
};

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
