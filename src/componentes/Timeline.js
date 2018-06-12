import React, { Component } from 'react';
import Foto from './Foto';
import ReactCSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import LogicaTimeLine from '../_logicas/LogicaTimeLine';

export default class Timeline extends Component {

    constructor(prosp) {
        super(prosp);
        this.state = {
            fotos: [],
        };

        this.login = this.props.login;
        this.LogicaTimeLine = new LogicaTimeLine();
    }

    // dispara antes do componente ser instanciado
    componentWillMount() {
        this.LogicaTimeLine.subscribe(fotos => {
            this._setFotos(fotos);
        });
    }

    // dispara quando o componete será instanciado
    componentDidMount() {
        this._loadFotos();
    }

    // dispara quando uma propriedade é alterada
    componentWillReceiveProps(nextProps) {
        if (nextProps.login !== undefined) {
            this.login = nextProps.login;
            this._loadFotos();
        }
    }

    _loadFotos() {
        this.LogicaTimeLine.loadFotos(this.login);
    }

    _setFotos(fotos) {
        this.setState({
            fotos: [].concat(fotos),
        });
        this.LogicaTimeLine = new LogicaTimeLine(this.state.fotos);
    }

    like(fotoId) {
        this.LogicaTimeLine.like(fotoId);
    }

    comenta(fotoId, comentario) {
        this.LogicaTimeLine.comenta(fotoId, comentario);
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
