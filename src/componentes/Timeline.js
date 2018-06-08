import React, { Component } from 'react';
import Helper from '../_helper/helper';
import Foto from './Foto';
import PubSub from 'pubsub-js';
import ReactCSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';

export default class Timeline extends Component {

    constructor(prosp) {
        super(prosp);
        this.state = {
            fotos: [],
        };

        this.login = this.props.login;
    }

    // dispara antes do componente ser instanciado
    componentWillMount() {
        PubSub.subscribe('timeline', (topico, fotos) => {
            this._setFotos(fotos);
        });
    }

    // dispara quando o componete será instanciado
    componentDidMount() {
        this._loadFotos();
    }

    // dispara quando uma propriedade é alterada
    componentWillReceibeProps(nextProps) {
        if (nextProps.login !== undefined) {
            this.login = nextProps.login;
            this._loadFotos();
        }
    }

    _loadFotos() {
        let urlPerfil;

        if (this.login === undefined) {
            urlPerfil = `${Helper.urlApi}/fotos?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`;
        } else {
            urlPerfil = `${Helper.urlApi}/public/fotos/${this.login}`;
        }

        fetch(urlPerfil)
            .then(response => response.json())
            .then(fotos => {
                // fake data
                fotos = [
                    {
                        urlPerfil: 'http://images.uncyc.org/pt/thumb/a/a8/Mr._Bean_realmeme.jpg/170px-Mr._Bean_realmeme.jpg',
                        loginUsuario: 'Mr. Been',
                        horario: '05/12/2016 16:21',
                        urlFoto: 'https://malaysianaccess.com/wp-content/uploads/Mr-Bean.jpg',
                        id: 3,
                        likeada: false,
                        likers: [],
                        comentarios: [
                            {
                                id: 1,
                                login: 'alots',
                                texto: 'Muito top cara!'
                            },
                            {
                                id: 2,
                                login: 'Lucão',
                                texto: 'Ce é bichão mesmo hein doido'
                            }
                        ]
                    }
                ];
                this._setFotos(fotos);
            });
    }

    _setFotos(fotos) {
        this.setState({
            fotos: fotos.length > 4 ? fotos.slice(0, 5) : fotos,
        });
    }

    like(fotoId) {
        fetch(`${Helper.urlApi}/fotos/${fotoId}/like?${Helper.authToken}`, { method: 'POST' })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Não foi possível realizar o like da foto')
                }
            })
            .then(liker => {
                PubSub.publish('atualiza-liker', { fotoId, liker });
            })
            .catch(err => {
                // fake comentario
                // PubSub.publish('atualiza-liker', { fotoId, liker: { login: 'Mr. Been' } });
                console.error(err);
            });
    }

    comenta(fotoId, comentario) {
        const requestInfo = {
            method: 'POST',
            body: JSON.stringify({ texto: comentario }),
            headers: new Headers({
                'Content-type': 'application/json',
            }),
        };

        fetch(`${Helper.urlApi}/fotos/${fotoId}/comment?${Helper.authToken}}`, requestInfo)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Não foi possível comentar na foto');
                }
            })
            .then(novoComentario => {
                PubSub.publish('novos-comentarios', { fotoId: fotoId, novoComentario });
            })
            .catch(err => {
                // fake comentario
                // PubSub.publish('novos-comentarios', { fotoId: fotoId, novoComentario: { id: parseInt(Math.random() * 100), login: 'Mr. Been', texto: comentario } });
                console.error(err);
            });
    }

    render() {
        return (
            <div className="fotos container">
                <ReactCSSTransitionGroup
                    transitionName="timeline"
                    transitionEnterTimeout={500}
                    transitionLeaveTimeout={300}>
                    {
                        this.state.fotos.map(foto => <Foto key={foto.id} foto={foto} like={this.like} comenta={this.comenta} />)
                    }
                </ReactCSSTransitionGroup>
            </div>
        );
    }
}
