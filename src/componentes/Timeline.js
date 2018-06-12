import React, { Component } from 'react';
import Foto from './Foto';
import ReactCSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import TimelineApi from '../_logicas/TimelineApi';

export default class Timeline extends Component {

    constructor(prosp) {
        super(prosp);
        this.state = {
            fotos: [],
        };

        this.login = this.props.login;
    }

    // dispara antes do componente ser instanciado
    componentWillMount() {
        // atualiza lista de fotos antes do componente ser renderizado
        this.props.store.subscribe(() => {
            this._setFotos(this.props.store.getState());
        });
    }

    // dispara quando o componete será instanciado
    componentDidMount() {
        this.carregaFotos();
    }

    // dispara quando uma propriedade é alterada
    componentWillReceiveProps(nextProps) {
        if (nextProps.login !== undefined) {
            this.login = nextProps.login;
            this.carregaFotos();
        }
    }

    carregaFotos() {
        TimelineApi.lista(this.login, this.props.store);
    }

    _setFotos(fotos) {
        this.setState({
            fotos: [].concat(fotos),
        });
        // this.props.store = new TimelineApi(this.state.fotos);
    }

    like(fotoId) {
        // this.props.store.like(fotoId);
    }

    comenta(fotoId, comentario) {
        // this.props.store.comenta(fotoId, comentario);
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
