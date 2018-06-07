import React from 'react';
import ReactDOM from 'react-dom';
import './css/reset.css';
import './css/login.css';
import './css/timeline.css';
import App from './App';
import Login from './componentes/Login';
import { Router, Route, browserHistory } from 'react-router';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
    (
        <Router history={browserHistory}>
            <Route path="/" component={Login} />
            <Route path="/timeline" component={App} />
        </Router>
    ),
    document.getElementById('root')
);
registerServiceWorker();
