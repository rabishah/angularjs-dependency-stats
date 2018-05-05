import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Home from './pages/Home';
import JSDeps from './pages/JSDeps';
import FourOhFour from './pages/FourOhFour';

import './App.css';

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

  callApi = async () => {
    const response = await fetch('/info');
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);

    return body;
  };

  render() {
    const {response} = this.state;
    return (
      <Router>
        <div>
          <Route exact path="/" render={(props) => <Home {...props} data={response} />} />
          <Route path="/js" render={(props) => <JSDeps {...props} data={response} />} />
        </div>
      </Router>
    )
  }
}

export default App;
