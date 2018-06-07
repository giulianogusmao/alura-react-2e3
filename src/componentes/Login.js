import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import Helper from '../_helper/helper';

export default class Login extends Component {

    constructor() {
        super();

        this.state = {
            msg: '',
        };
    }

    _setMsg(msg) {
        this.setState({
            msg: msg,
        });
    }

    enviaForm(event) {
        event.preventDefault();

        const requestInfo = {
            method: 'POST',
            body: JSON.stringify({ login: this.login.value, senha: this.senha.value }),
            headers: new Headers({
                'Content-type': 'application/json',
            }),
        }

        fetch(`${Helper.urlApi}/posts`, requestInfo)
            .then(response => {
                if (response.ok) {
                    return response.text();
                } else {
                    throw new Error('Não foi possível realizar o login');

                }
            })
            .then(token => {
                localStorage.setItem('auth-token', 'aisjl13K2Mc13OXI4JXo5ijX7a1sd2')
                browserHistory.push('/timeline');
            })
            .catch(err => {
                this._setMsg(err);
            });
    }

    render() {
        return (
            <div className="login-box">
                <h1 className="header-logo">Instalura</h1>
                <form onSubmit={this.enviaForm.bind(this)}>
                    <span></span>
                    <input type="text" ref={input => this.login = input} />
                    <input type="password" ref={input => this.senha = input} />
                    <input type="submit" value="login" />
                </form>
            </div>
        );
    }
}
