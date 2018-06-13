import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Header from './componentes/Header';
import Timeline from './componentes/Timeline';

class App extends Component {
  render() {
    return (
      <div id="root">
        <div className="main">
          <Header />
          <Timeline login={this.props.params.login} />
        </div>
      </div>
    );
  }
}

App.contextTypes = {
  store: PropTypes.object.isRequired
}

export default App;
