import Helper from '../_helper/helper';
import PubSub from 'pubsub-js';

export default class TimelineApi {

    constructor(fotos) {
        this.fotos = [].concat(fotos);
    }

    like(fotoId) {
        return fetch(`${Helper.urlApi}/fotos/${fotoId}/like?${Helper.authToken}`, { method: 'POST' })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Não foi possível realizar o like da foto')
                }
            })
            .then(liker => {
                const fotoAchada = this.fotos.find(foto => foto.id === fotoId);
                const possivelLiker = fotoAchada.likers.find(likerAtual => likerAtual.login === liker.login);
                fotoAchada.likeada = !fotoAchada.likeada;

                if (possivelLiker === undefined) {
                    // caso não tenha encontrado o liker adiciona na lista de likers
                    fotoAchada.likers.push(liker);
                } else {
                    // remove da lista de likers
                    fotoAchada.likers = fotoAchada.likers.filter(likerAtual => likerAtual.login !== liker.login);
                }

                // atualiza timeline com novo array de fotos
                PubSub.publish('timeline', this.fotos);
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

        fetch(`${Helper.urlApi}/fotos/${fotoId}/comment?${Helper.authToken}`, requestInfo)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Não foi possível comentar na foto');
                }
            })
            .then(novoComentario => {
                const fotoAchada = this.fotos.find(foto => foto.id === fotoId);
                fotoAchada.comentarios.push(novoComentario);

                // atualiza timeline com novo array de fotos
                PubSub.publish('timeline', this.fotos);
            })
            .catch(err => {
                // fake comentario
                // PubSub.publish('novos-comentarios', { fotoId: fotoId, novoComentario: { id: parseInt((Math.random() * 100), 10), login: 'Mr. Been', texto: comentario } });
                console.error(err);
            });
    }


    static lista(login, store) {
        // fetch(urlPerfil).then(response => response.json()).then(fotos => {
        //     store.dispatch({ type: 'LISTAGEM', fotos });
        // });

        let urlPerfil;

        if (login === undefined) {
            urlPerfil = `${Helper.urlApi}/fotos?${Helper.authToken}`;
        } else {
            urlPerfil = `${Helper.urlApi}/public/fotos/${login}`;
        }

        fetch(urlPerfil)
            .then(response => response.json())
            .then(fotos => {
                store.dispatch({ type: 'LISTAGEM', fotos });
            });
    }

    subscribe(callback) {
        PubSub.subscribe('timeline', (topico, fotos) => {
            callback(fotos);
        });
    }
}
