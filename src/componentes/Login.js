import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import Helper from '../_helper/helper';

export default class Login extends Component {

    constructor(props) {
        super(props);

        this.state = {
            msg: (this.props.location.query['msg'] || ''),
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

        fetch(`${Helper.urlApi}/public/login`, requestInfo)
            .then(response => {
                if (response.ok) {
                    return response.text();
                } else {
                    throw new Error('Não foi possível realizar o login');

                }
            })
            .then(token => {
                Helper.authToken = token;
                browserHistory.push('/timeline');
            })
            .catch(err => {
                this._setMsg(err.message);
            });
    }

    render() {
        return (
            <div className="login-box">
                <h1 className="header-logo">Instalura</h1>
                <form onSubmit={this.enviaForm.bind(this)}>
                    <span className="text-msg">{this.state.msg}</span>
                    <input type="text" ref={(input) => this.login = input} placeholder="Login: alots" />
                    <input type="password" ref={(input) => this.senha = input} placeholder="Senha: 123456" />
                    {/* 
                        usuário = alots, senha = 123456;
                        usuário = rafael, senha = 123456;
                        usuário = vitor, senha = 123456 
                    */}
                    <input type="submit" value="login" />
                </form>
            </div>
        );
    }
}
