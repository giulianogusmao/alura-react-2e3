import Helper from '../_helper/helper';
import { listagem, comentario, like } from '../_actions/actionCreator';

export default class TimelineApi {

    static like(fotoId) {
        return dispatch => {
            fetch(`${Helper.urlApi}/fotos/${fotoId}/like?${Helper.authToken}`, { method: 'POST' })
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error('Não foi possível realizar o like da foto')
                    }
                })
                .then(liker => {
                    dispatch(like(fotoId, liker));
                    return liker;
                })
                .catch(err => {
                    console.error(err);
                });
        };
    }

    static comenta(fotoId, textoComentario) {
        return dispatch => {
            const requestInfo = {
                method: 'POST',
                body: JSON.stringify({ texto: textoComentario }),
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
                    dispatch(comentario(fotoId, novoComentario));
                    return novoComentario;
                })
                .catch(err => {
                    console.error(err);
                });
        };
    }

    static lista(login) {
        return dispatch => {
            let urlPerfil;

            if (login === undefined) {
                urlPerfil = `${Helper.urlApi}/fotos?${Helper.authToken}`;
            } else {
                urlPerfil = `${Helper.urlApi}/public/fotos/${login}`;
            }

            fetch(urlPerfil)
                .then(response => response.json())
                .then(fotos => {
                    dispatch(listagem(fotos));
                    return fotos;
                });
        };
    }
}
