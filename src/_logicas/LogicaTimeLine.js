import Helper from '../_helper/helper';
import PubSub from 'pubsub-js';

export default class LogicaTimeLine {

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
}
