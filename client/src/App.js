import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import MainNav from './components/Navigation/MainNav';

import AuthPage from './pages/Auth';
import BookingsPage from './pages/Bookings';
import EventsPage from './pages/Events';

import './App.css';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <React.Fragment>
          <MainNav />
          <main className='main-content'>
            <Switch>
              <Redirect from='/' to='/auth' exact />
              <Route path='/auth' component={AuthPage} />
              <Route path='/events' component={EventsPage} />
              <Route path='/bookings' component={BookingsPage} />
            </Switch>
          </main>
        </React.Fragment>
      </BrowserRouter>
    );
  }
}

export default App;
