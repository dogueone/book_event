const Event = require('../../models/event');
const User = require('../../models/user');
// const {dateToString} = require('../../helpers/date');

/* const transformEvent = event => {
  return {
    ...event._doc,
    date: dateToString(event._doc.date).toISOString(),
    creator: user.bind(this, event.creator)
  };
}; */

/* const transformBooking = booking => {
  return {
    ...booking._doc,
    user: user.bind(this, booking._doc.user),
    event: singleEvent.bind(this, booking._doc.event),
    createdAt: dateToString(booking._doc.createdAt),
    updatedAt: dateToString(booking._doc.updatedAt)
  };
}; */

// Manual population (deep population)
// These functions are not executed as long as we dont request that specific property(value) => its not infinite loop

const user = async userId => {
  try {
    const user = await User.findById(userId);
    return {
      ...user._doc,
      createdEvents: events.bind(this, user._doc.createdEvents)
    };
  } catch (err) {
    throw err;
  }
};

// Manual population; to get all events where id of the event is one of the ids in array
// we call a function (user) to access creator properties (GraphQL parses values that are functions and return value)
const events = async eventIds => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } });
    return events.map(event => {
      return {
        ...event._doc,
        date: new Date(event._doc.date).toISOString(),
        creator: user.bind(this, event.creator)
      };
    });
  } catch (err) {
    throw err;
  }
};

const singleEvent = async eventId => {
  try {
    const event = await Event.findById(eventId);
    return {
      ...event._doc,
      date: new Date(event._doc.date).toISOString(),
      creator: user.bind(this, event.creator)
    };
  } catch (err) {
    throw err;
  }
};

// exports.transformEvent = transformEvent;
// exports.transformBooking = transformBooking;
exports.user = user;
// exports.events = events;
exports.singleEvent = singleEvent;
