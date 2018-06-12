export function timeline(state = [], action) {
    if (action.type === 'LISTAGEM') {
        return action.fotos;
    }

    if (action.type === 'COMENTARIO') {
        const fotoAchada = state.find(foto => foto.id === action.fotoId);        
        fotoAchada.comentarios.push(action.novoComentario);

        return state;
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
