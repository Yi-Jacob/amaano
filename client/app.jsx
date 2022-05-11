import React from 'react';
import Home from './pages/home';
import Results from './pages/results';
import Bookmarks from './pages/bookmarks';
import Transactions from './pages/transactions';
import Mining from './pages/mining';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import Wrapper from './components/wrapper';

export default class App extends React.Component {

  render() {
    return (
      <>
        <Router>
          <Switch>
            <Route exact path="/"
              component={Wrapper(Home)} />
            <Route exact path="/search-results"
              component={Wrapper(Results)} />
            <Route exact path="/bookmarks"
              component={Wrapper(Bookmarks)} />
            <Route exact path="/mining"
              component={Wrapper(Mining)} />
            <Route exact path="/transactions"
              component={Wrapper(Transactions)} />
          </Switch>
        </Router>
      </>
    );
  }
}
