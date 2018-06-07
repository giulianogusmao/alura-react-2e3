import React, { Component } from 'react';
import Helper from '../_helper/helper';
import Foto from './Foto';

export default class Timeline extends Component {

    constructor() {
        super();
        this.state = {
            fotos: [],
        };
    }

    componentDidMount() {
        this._loadFotos()
            .then(response => response.json())
            .then(fotos => {
                this._setFotos(fotos);
            })
    }

    _setFotos(fotos) {
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
        ]
        this.setState({
            fotos: fotos.length > 4 ? fotos.slice(0, 5) : fotos,
        });
    }

    _loadFotos() {
        return fetch(`${Helper.urlApi}/posts?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`);
    }

    render() {
        return (
            <div className="fotos container">
                {
                    this.state.fotos.map(foto => <Foto key={foto.id} foto={foto} />)
                }
            </div>
        );
    }
}
