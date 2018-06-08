import React, { Component } from 'react';
import PubSub from 'pubsub-js';
import Helper from '../_helper/helper';

export default class Header extends Component {

  pesquisa(event) {
    event.preventDefault();

    fetch(`${Helper.urlApi}/public/fotos/${this.loginPesquisado.value}`)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Erro ao pesquisar');
        }
      }) 
      .then(fotos => {
        PubSub.publish('timeline', fotos);
      })
      .catch(err => {
        // fake data
        // PubSub.publish('timeline', [
        //     {
        //       urlPerfil: 'http://images.uncyc.org/pt/thumb/a/a8/Mr._Bean_realmeme.jpg/170px-Mr._Bean_realmeme.jpg',
        //       loginUsuario: 'Mr. Been',
        //       horario: '05/12/2016 16:21',
        //     urlFoto: 'https://4.bp.blogspot.com/-Lc0wsSOKqyY/WX-_tG2jJ5I/AAAAAAAAAI4/sWIQOcJ4-4UGGpMb9-djUwRSShZVPpIiwCLcBGAs/s1600/bin-Walther-Alvarenga.jpg',
        //       id: 65,
        //       likeada: true,
        //       likers: [
        //         {
        //           id: 1,
        //           login: 'alots',                  
        //         }
        //       ],
        //       comentarios: [
        //         {
        //           id: 1,
        //           login: 'alots',
        //           texto: 'Muito top cara!'
        //         },
        //       ]
        //     }
        //   ]);
        console.error(err);
      });
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
