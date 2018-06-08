import React, { Component } from 'react';
import { Link } from 'react-router';
import PubSub from 'pubsub-js';
import Helper from '../_helper/helper';

class FotoAtualizacoes extends Component {

  constructor(props) {
    super(props);

    this.state = {
      likeada: this.props.foto.likeada,
    };
  }

  componentWillMount() {
    // Atualiza likeada
    PubSub.subscribe('atualiza-liker', (topico, infoLiker) => {
      if (this.props.foto.id === infoLiker.fotoId) {
        if (infoLiker.liker.login === this.props.foto.loginUsuario) {
          this.setState({
            likeada: !this.state.likeada
          });
        }
      }
    })
  }

  like(event) {
    event.preventDefault();
    this.props.like(this.props.foto.id);
  }

  comenta(event) {
    event.preventDefault();
    this.props.comenta(this.props.foto.id, this.comentario.value);
  }

  render(){
    return (
      <section className="fotoAtualizacoes">
        <a onClick={this.like.bind(this)} className={'fotoAtualizacoes-like' + (this.state.likeada ? ' active' : '') }>Likar</a>
        <form className="fotoAtualizacoes-form" onSubmit={this.comenta.bind(this)}>
          <input type="text" placeholder="Adicione um comentário..." className="fotoAtualizacoes-form-campo" ref={(input) => this.comentario = input} />
          <input type="submit" value="Comentar!" className="fotoAtualizacoes-form-submit"/>
        </form>
      </section>
    );
  }
}

class FotoInfo extends Component {

  constructor(props) {
    super(props);

    this.state = {
      likers: this.props.foto.likers,
      comentarios: this.props.foto.comentarios,
    };
  }

  // antes do render ser chamado
  componentWillMount() {

    // Atualiza lista de curtidas
    PubSub.subscribe('atualiza-liker', (topico, infoLiker) => {
      if (this.props.foto.id === infoLiker.fotoId) {
        const possivelLiker = this.state.likers.find(liker => liker.login === infoLiker.liker.login);

        if (possivelLiker === undefined) {
          // caso não tenha encontrado o liker adiciona na lista de likers
          
          /* ATENÇÂO
           * Exemplo de aplicação imutável concatenando os itens e depois aplicando no state, 
           * desta forma não alterar diretamente o objeto.
           */
          const novosLikers = this.state.likers.concat(infoLiker.liker);
          this.setState({ likers: novosLikers });
        } else {
          // remove da lista de likers
          const novosLikers = this.state.likers.filter(liker => liker.login !== infoLiker.liker.login);
          this.setState({ likers: novosLikers });
        }
      }
    });


    // Atualiza lista de comentários
    PubSub.subscribe('novos-comentarios', (topico, comentario) => {
      if (this.props.foto.id === comentario.fotoId) {
        const novosComentarios = this.state.comentarios.concat(comentario.novoComentario);
        this.setState({
          comentarios: novosComentarios
        });
      }
    });
  }
  
  render(){
    return (
      <div className="foto-in fo">
        <div className="foto-info-likes">
          {
            this.state.likers.map(liker => {
              return <Link to={`/timeline/${liker.login}`} key={liker.login}>{liker.login}, </Link>
            })
          }

            curtiram
        
        </div>

        <p className="foto-info-legenda">
          <a className="foto-info-autor">autor </a>
          comentário
        </p>

        <ul className="foto-info-comentarios">
          {
            this.state.comentarios.map(comentario =>
              <li key={comentario.id} className="comentario">
                <Link to={`/timeline/${comentario.login}`} className="foto-info-autor">{comentario.login} </Link>
                {comentario.texto}
              </li>)
          }
        </ul>
      </div>            
    );
  }
}

class FotoHeader extends Component {
    render(){
        return (
          <header className="foto-header">
              <figure className="foto-usuario">
              <img src={this.props.foto.urlPerfil} alt="foto do usuario" />
                <figcaption className="foto-usuario">
                  <Link to={`/timeline/${this.props.foto.loginUsuario}`}>
                    {this.props.foto.loginUsuario}
                  </Link>  
                </figcaption>
              </figure>
            <time className="foto-data">{this.props.foto.horario}</time>
          </header>            
        );
    }
}

export default class Foto extends Component {
    render(){
        return (
          <div className="foto">
            <FotoHeader foto={this.props.foto} />
            <img alt="foto" className="foto-src" src={this.props.foto.urlFoto}/>
            <FotoInfo foto={this.props.foto} />
            <FotoAtualizacoes {...this.props} />
          </div>
        );
    }
}
