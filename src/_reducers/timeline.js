import { List } from 'immutable';

export function timeline(state = new List(), action) {
    if (action.type === 'LISTAGEM') {
        return action.fotos;
        // return new List(action.fotos); // bug
    }

    if (action.type === 'COMENTARIO') {
        const fotoEstadoAntigo = state.find(foto => foto.id === action.fotoId);
        const novosComentarios = fotoEstadoAntigo.comentarios.concat(action.novoComentario);

        const fotoEstadoNovo = Object.assign({}, fotoEstadoAntigo, { comentarios: novosComentarios });

        const indiceDaLista = state.findIndex(foto => foto.id === action.fotoId);
        const novaLista = state.set(indiceDaLista, fotoEstadoNovo);

        return novaLista;
    }

    if (action.type === 'LIKE') {
        const liker = action.liker;
        const fotoAchada = state.find(foto => foto.id === action.fotoId);
        const possivelLiker = fotoAchada.likers.find(likerAtual => likerAtual.login === liker.login);
        fotoAchada.likeada = !fotoAchada.likeada;

        if (possivelLiker === undefined) {
            // caso não tenha encontrado o liker adiciona na lista de likers
            fotoAchada.likers.push(liker);
        } else {
            // remove da lista de likers
            fotoAchada.likers = fotoAchada.likers.filter(likerAtual => likerAtual.login !== liker.login);
        }

        return state;
    }


    return state;
}
