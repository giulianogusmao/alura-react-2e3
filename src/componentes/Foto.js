import React, { Component } from 'react';
import { Link } from 'react-router';
import Helper from '../_helper/helper';

class FotoAtualizacoes extends Component {

  constructor(props) {
    super(props);

    this.state = {
      likeada: this.props.foto.likeada
    };
  }

  like(event) {
    event.preventDefault();

    fetch(`${Helper.urlApi}/like`, { method: 'POST' })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Não foi possível realizar o like da foto')
        }
      })
      .then(liker => {
        this.setState({
          likeada: !this.state.likeada
        })
      })
      .catch(err => {
        console.error(err);
      });
  }

  render(){
      return (
          <section className="fotoAtualizacoes">
          <a onClick={this.like.bind(this)} className={'fotoAtualizacoes-like' + (this.state.likeada ? ' active' : '') }>Likar</a>
            <form className="fotoAtualizacoes-form">
              <input type="text" placeholder="Adicione um comentário..." className="fotoAtualizacoes-form-campo"/>
              <input type="submit" value="Comentar!" className="fotoAtualizacoes-form-submit"/>
            </form>
          </section>
      );
  }
}

class FotoInfo extends Component {
    render(){
        return (
            <div className="foto-in fo">
              <div className="foto-info-likes">
                {
                  this.props.foto.likers.map(liker => {
                    return <Link to={`/timeline/${liker.login}`} key={liker.login}>{liker.login},</Link>
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
                  this.props.foto.comentarios.map(comentario => 
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
            <FotoAtualizacoes foto={this.props.foto} />
          </div>            
        );
    }
}
