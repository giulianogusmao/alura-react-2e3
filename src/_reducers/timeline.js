function trocaFoto(lista, fotoId, callbackNovosParametros) {
    const fotoEstadoAntigo = lista.find(foto => foto.id === fotoId);
    const fotoEstadoNovo = Object.assign({}, fotoEstadoAntigo, callbackNovosParametros(fotoEstadoAntigo));
    const indexFotoAntiga = lista.findIndex(foto => foto.id === fotoId);
    // return lista.set(indexFotoAntiga, fotoEstadoNovo); // bug ao executar .set()

    // substituindo elementos de forma manual
    lista.splice(indexFotoAntiga, 1, fotoEstadoNovo);
    return lista;
}

export function timeline(state = [].concat(), action) {
    if (action.type === 'LISTAGEM') {
        return [].concat(action.fotos);
    }

    if (action.type === 'COMENTARIO') {
        return trocaFoto(state, action.fotoId, (fotoEstadoAntigo) => {
            const novosComentarios = fotoEstadoAntigo.comentarios.concat(action.novoComentario);
            return { comentarios: novosComentarios };            
        });
    }

    if (action.type === 'LIKE') {
        return trocaFoto(state, action.fotoId, (fotoEstadoAntigo) => {
            const liker = action.liker;
            const possivelLiker = fotoEstadoAntigo.likers.find(likerAtual => likerAtual.login === liker.login);
            let novosLikers = [];

            if (possivelLiker === undefined) {
                // caso não tenha encontrado o liker adiciona na lista de likers
                novosLikers = fotoEstadoAntigo.likers.concat(liker);
            } else {
                // remove da lista de likers
                novosLikers = fotoEstadoAntigo.likers.filter(likerAtual => likerAtual.login !== liker.login);
            }

            return { likeada: !fotoEstadoAntigo.likeada, likers: novosLikers };
        });
    }


    return state;
}
