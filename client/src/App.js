import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Home from './pages/Home';
import JSDeps from './pages/JSDeps';
import FourOhFour from './pages/FourOhFour';

import './App.css';

import history from './history';

const PAGES = {
  '/': Home,
  '/jsdeps': JSDeps
};

class App extends Component {
  state = {
    response: '',
    pathname: window.location.pathname
  };

  componentWillMount() {
    this.callApi()
      .then(response => this.setState({ response: response }))
      .catch(error => console.log(error));
  };

  componentDidMount() {
    const self = this;

    history.onChange((pathname) => {
      self.setState({ pathname })
    });
  }

  callApi = async () => {
    const response = await fetch('/info');
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);

    return body;
  };

  render() {
    const Handler = PAGES[this.state.pathname] || FourOhFour;
    return <Handler data={this.state.response} />;
  }
}

App.propTypes = {
  pathname: PropTypes.oneOf(Object.keys(PAGES)).isRequired,
};

export default App;
