import React, { Component } from 'react';
import Helper from '../_helper/helper';
import Foto from './Foto';
import PubSub from 'pubsub-js';
import ReactCSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import LogicaTimeLine from '../_logicas/LogicaTimeLine';

export default class Timeline extends Component {

    constructor(prosp) {
        super(prosp);
        this.state = {
            fotos: [],
        };

        this.login = this.props.login;
        this.LogicaTimeLine = new LogicaTimeLine();
    }

    // dispara antes do componente ser instanciado
    componentWillMount() {
        PubSub.subscribe('timeline', (topico, fotos) => {
            this._setFotos(fotos);
        });

        // Atualiza lista de curtidas
        PubSub.subscribe('atualiza-liker', (topico, infoLiker) => {
        });

        // Atualiza lista de comentários
        PubSub.subscribe('novos-comentarios', (topico, comentario) => {
            const fotoAchada = this.state.fotos.find(foto => foto.id === comentario.fotoId);
            fotoAchada.comentarios.push(comentario.novoComentario);
            this.setState({
                fotos: this.state.fotos
            });
        });
    }

    // dispara quando o componete será instanciado
    componentDidMount() {
        this._loadFotos();
    }

    // dispara quando uma propriedade é alterada
    componentWillReceiveProps(nextProps) {
        if (nextProps.login !== undefined) {
            this.login = nextProps.login;
            this._loadFotos();
        }
    }

    _loadFotos() {
        let urlPerfil;

        if (this.login === undefined) {
            urlPerfil = `${Helper.urlApi}/fotos?${Helper.authToken}`;
        } else {
            urlPerfil = `${Helper.urlApi}/public/fotos/${this.login}`;
        }

        fetch(urlPerfil)
            .then(response => response.json())
            .then(fotos => {
                if (Array.isArray(fotos)) {
                    this._setFotos(fotos);
                } else {
                    throw new Error(fotos);
                }
            })
            .catch(err => {
                console.error('Não foi possível carregar a timeline');
                console.error(JSON.stringify(err.message));
            });
    }

    _setFotos(fotos) {
        this.setState({
            fotos: [].concat(fotos),
        });
        this.LogicaTimeLine = new LogicaTimeLine(this.state.fotos);
    }

    like(fotoId) {
        this.LogicaTimeLine.like(fotoId);

        // fetch(`${Helper.urlApi}/fotos/${fotoId}/like?${Helper.authToken}`, { method: 'POST' })
        //     .then(response => {
        //         if (response.ok) {
        //             return response.json();
        //         } else {
        //             throw new Error('Não foi possível realizar o like da foto')
        //         }
        //     })
        //     .then(liker => {
        //         PubSub.publish('atualiza-liker', { fotoId, liker });
        //     })
        //     .catch(err => {
        //         // fake comentario
        //         // PubSub.publish('atualiza-liker', { fotoId, liker: { login: 'Mr. Been' } });
        //         console.error(err);
        //     });
    }

    comenta(fotoId, comentario) {
        const requestInfo = {
            method: 'POST',
            body: JSON.stringify({ texto: comentario }),
            headers: new Headers({
                'Content-type': 'application/json',
            }),
        };

        fetch(`${Helper.urlApi}/fotos/${fotoId}/comment?${Helper.authToken}`, requestInfo)
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
                // PubSub.publish('novos-comentarios', { fotoId: fotoId, novoComentario: { id: parseInt((Math.random() * 100), 10), login: 'Mr. Been', texto: comentario } });
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
                        this.state.fotos.map(foto => <Foto key={foto.id} foto={foto} like={this.like.bind(this)} comenta={this.comenta.bind(this)} />)
                    }
                </ReactCSSTransitionGroup>
            </div>
        );
    }
}
