import React, { Component } from 'react';
import { connect } from 'react-redux';
import TimelineApi from '../_logicas/TimelineApi';

class Header extends Component {

  pesquisa(event) {
    event.preventDefault();
    this.props.pesquisa(this.loginPesquisado.value);
  }

  render() {
    return (
      <header className="header container">
        <h1 className="header-logo">
          Instalura
        </h1>

        <form className="header-busca" onSubmit={this.pesquisa.bind(this)}>
          <input type="text" name="search" placeholder="Pesquisa" className="header-busca-campo" ref={(input) => this.loginPesquisado = input} />
          <input type="submit" value="Buscar" className="header-busca-submit" />
          <span>{this.props.msg}</span>
        </form>

        <nav>
          <ul className="header-nav">
            <li className="header-nav-item">
              <a>
                ♡
                  {/*                 ♥ */}
                {/* Quem deu like nas minhas fotos */}
              </a>
            </li>
          </ul>
        </nav>
      </header>
    );
  }
}

const mapStateToProps = state => {
  return { msg: state.notificacao }
}

const mapDispatchToProps = dispatch => {
  return {
    pesquisa: (loginPesquisado) => {
      dispatch(TimelineApi.pesquisa(loginPesquisado));
    },
  }
}

const HeaderConatiner = connect(mapStateToProps, mapDispatchToProps)(Header);

export default HeaderConatiner;