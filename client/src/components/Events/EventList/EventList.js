import React from 'react';

import EventItem from './EventItem/EventItem';
import './EventList.css';

const EventList = props => {
  const eventList = props.events.map(event => {
    return (
      <EventItem
        key={event._id}
        eventId={event._id}
        title={event.title}
        price={event.price}
        date={event.date}
        userId={props.authUserId}
        creatorId={event.creator._id}
        onDetail={props.onViewDetail}
      />
    );
  });

  return <ul className='event__list'>{eventList}</ul>;
};

export default EventList;
