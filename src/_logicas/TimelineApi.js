import Helper from '../_helper/helper';

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
                    dispatch({ type: 'LIKE', fotoId, liker });
                    return liker;
                })
                .catch(err => {
                    console.error(err);
                });
        };
    }

    static comenta(fotoId, comentario) {
        return dispatch => {
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
                    dispatch({ type: 'COMENTARIO', fotoId, novoComentario });
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
                    dispatch({ type: 'LISTAGEM', fotos });
                    return fotos;
                });
        };
    }
}