const bcrypt = require('bcryptjs');

const Event = require('../../models/event');
const User = require('../../models/user');

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
        return {
          ...event._doc,
          date: new Date(event._doc.date).toISOString(),
          creator: user.bind(this, event.creator)
        };
      });
    })
    .catch(err => {
      throw err;
    });
};

module.exports = {
  events: () => {
    return (
      Event.find()
        //.populate('creator') to access creator user properties within event object
        .then(events => {
          return events.map(event => {
            /* {
              ...event._doc,
              _id: event.id,
              creator: {
                ...event._doc.creator._doc,
                _id: event._doc.creator.id
              }
            }; */

            return {
              ...event._doc,
              date: new Date(event._doc.date).toISOString(),
              creator: user.bind(this, event._doc.creator)
            };
          });
        })
        .catch(err => {
          throw err;
        })
    );
  },
  createEvent: args => {
    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: new Date(args.eventInput.date),
      creator: '5dd17a22dc562d39408d19ee'
    });
    let createdEvent;
    return event
      .save()
      .then(result => {
        //to leave out all metadata of the returned Event(_doc - property provided by mongoose)
        //transform _id to normal string that is understood by graphql; mongoose shortcut _id: event.id
        // { ...result._doc, _id: result._doc._id.toString() }
        createdEvent = {
          ...result._doc,
          date: new Date(event._doc.date).toISOString(),
          creator: user.bind(this, result._doc.creator)
        };
        return User.findById('5dd17a22dc562d39408d19ee');
      })
      .then(user => {
        if (!user) {
          throw new Error('User not found.');
        }
        user.createdEvents.push(event);
        return user.save();
      })
      .then(result => {
        return createdEvent;
      })
      .catch(err => {
        console.log(err);
        throw err;
      });
  },
  createUser: args => {
    return User.findOne({ email: args.userInput.email })
      .then(user => {
        if (user) {
          throw new Error('User exists already.');
        }
        return bcrypt.hash(args.userInput.password, 12);
      })
      .then(hashedPassword => {
        const user = new User({
          email: args.userInput.email,
          password: hashedPassword
        });
        return user.save();
      })
      .then(result => {
        // { ...result._doc, password: null, _id: result.id }
        return { ...result._doc, password: null };
      })
      .catch(err => {
        throw err;
      });
  }
};
