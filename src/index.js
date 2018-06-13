import React from 'react';
import ReactDOM from 'react-dom';
import './css/reset.css';
import './css/login.css';
import './css/timeline.css';
import App from './App';
import Login from './componentes/Login';
import Logout from './componentes/Logout';
import { Router, Route, browserHistory } from 'react-router';
import { matchPattern } from 'react-router/lib/PatternUtils';
import {
    createStore,
    applyMiddleware,
    combineReducers
} from 'redux';
import thunkMiddleware from 'redux-thunk';
import { timeline } from './_reducers/timeline';
import { notificacao } from './_reducers/header';
import { Provider } from 'react-redux';
import registerServiceWorker from './registerServiceWorker';

function verificaAutenticacao(nextState, replace) {
    const resultado = matchPattern('/timeline(/:login)', nextState.location.pathname);
    const enderecoPrivadoTimeline = resultado.paramValues[0] === undefined;
    // console.log(resultado);
    if (enderecoPrivadoTimeline && localStorage.getItem('auth-token') === null) {
        replace('/?msg=você precisa estar logado para acessar o endereço');
    }
}

const reducers = combineReducers({ timeline, notificacao });
const store = createStore(reducers, applyMiddleware(thunkMiddleware));

ReactDOM.render(
    (
        <Provider store={store}>
            <Router history={browserHistory}>
                <Route path="/" component={Login} />
                <Route path="/timeline(/:login)" component={App} onEnter={verificaAutenticacao} />
                <Route path="/logout" component={Logout} />
            </Router>
        </Provider>
    ),
    document.getElementById('root')
);
registerServiceWorker();
