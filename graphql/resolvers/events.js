const Event = require('../../models/event');
const { dateToString } = require('../../helpers/date');
const { user } = require('./merge');
const User = require('../../models/user');

// const { transformEvent } = require('./merge');

module.exports = {
  events: async () => {
    try {
      const events = await Event.find();
      //.populate('creator') to access creator user properties within event object
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
    } catch (err) {
      throw err;
    }
  },
  //second arg of the resolver func is req obj by default
  createEvent: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: new Date(args.eventInput.date),
      //got it from the token and asigned to req obj if token had been verified
      creator: req.userId
    });
    let createdEvent;
    try {
      const result = await event.save();
      //to leave out all metadata of the returned Event(_doc - property provided by mongoose)
      //transform _id to normal string that is understood by graphql; mongoose shortcut _id: event.id
      // { ...result._doc, _id: result._doc._id.toString() }
      createdEvent = {
        ...result._doc,
        date: new Date(event._doc.date).toISOString(),
        creator: user.bind(this, result._doc.creator)
      };
      const creator = await User.findById(req.userId);
      if (!creator) {
        throw new Error('User not found.');
      }
      creator.createdEvents.push(event);
      await creator.save();

      return createdEvent;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
};
