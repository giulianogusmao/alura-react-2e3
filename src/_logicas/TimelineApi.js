import Helper from '../_helper/helper';
import { 
    listagem,
    comentario,
    like,
    notifica,
} from '../_actions/actionCreator';

export default class TimelineApi {

    static like(fotoId) {
        return dispatch => {
            Helper.api(`/fotos/${fotoId}/like?${Helper.authToken}`, 'Não foi possível realizar o like da foto', { method: 'POST' })
                .then(liker => {
                    dispatch(like(fotoId, liker));
                    return liker;
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

            Helper.api(`/fotos/${fotoId}/comment?${Helper.authToken}`, 'Não foi possível comentar na foto', requestInfo)
                .then(novoComentario => {
                    dispatch(comentario(fotoId, novoComentario));
                    return novoComentario;
                });
        };
    }

    static lista(login) {
        return dispatch => {
            let urlPerfil;

            if (login === undefined) {
                urlPerfil = `/fotos?${Helper.authToken}`;
            } else {
                urlPerfil = `/public/fotos/${login}`;
            }

            Helper.api(urlPerfil, 'Não foi possível carregar a timeline')
                .then(fotos => {
                    dispatch(listagem(fotos));
                    return fotos;
                });
        };
    }

    static pesquisa(login) {
        return (dispatch) => {
            Helper.api(`/public/fotos/${login}`, 'Erro ao pesquisar')
                .then(fotos => {
                    dispatch(notifica((fotos.length === 0) ? 'Usuário não encontrado' : ''));
                    dispatch(listagem(fotos));
                    return fotos;
                });
        };
    }
}
