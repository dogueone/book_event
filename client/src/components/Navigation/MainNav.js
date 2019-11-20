import React from 'react';
//to prevent real request sent by anchor tags (reload the page) and catch any clicks on link(NavLink also add active class for every link)
import { NavLink } from 'react-router-dom';
//c-r-a uses webpack that sees your import, take ccs code and inject it into the final page
import './MainNav.css';

const MainNav = props => {
  return (
    <header className='main-nav'>
      <div className='main-nav__logo'>
        <h1>EventBook</h1>
      </div>
      <nav className='main-nav__items'>
        <ul>
          <li>
            <NavLink to='/auth'>Authenticate</NavLink>
          </li>
          <li>
            <NavLink to='/events'>Events</NavLink>
          </li>
          <li>
            <NavLink to='/bookings'>Bookings</NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default MainNav;
