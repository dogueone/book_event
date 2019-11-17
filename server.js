const express = require('express');
const connectDB = require('./config/db');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');

const app = express();

const events = [];

// Connect Database
connectDB();

// Init Middleware to get the data in req.body
app.use(express.json({ extended: false }));

app.use(
  '/graphql',
  graphqlHttp({
    schema: buildSchema(`
        type Event {
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String!
        }
    
    
        type RootQuery {
            events: [Event!]!
        }

        type RootMutation {
            createEvent(eventInput:EventInput): Event
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    // rootValue - bundle of all the resolvers we have (logic to act on incoming requests)
    rootValue: {
      events: () => {
        return events;
      },
      createEvent: args => {
        const event = {
          _id: Math.random().toString(),
          title: args.eventInput.title,
          description: args.eventInput.description,
          //+-converted to a number
          price: +args.eventInput.price,
          date: args.eventInput.date
          // new Date().toISOString()
        };
        events.push(event);
        return event;
        /* http://localhost:5000/graphql
        mutation {
            createEvent(eventInput:{title: "A Test", description: "Does this work?", price: 9.99, date: "2019-11-16T22:19:25.011Z"}) {
              title
              description
            }
          } */
      }
    },
    graphiql: true
  })
);

app.get('/', (req, res) => res.send('API Running'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
