import React, { Component } from 'react';
import Foto from './Foto';
import ReactCSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import TimelineApi from '../_logicas/TimelineApi';
import { connect } from 'react-redux';

class Timeline extends Component {

    constructor(prosp) {
        super(prosp);
        this.login = this.props.login;
    }

    // dispara quando o componete será instanciado
    componentDidMount() {
        this.carregaFotos();
    }

    // dispara quando uma propriedade é alterada
    componentWillReceiveProps(nextProps) {
        if (nextProps.login !== this.login) {
            this.login = nextProps.login;
            this.carregaFotos();
        }
    }

    carregaFotos() {
        this.props.lista(this.login);
    }

    render() {
        return (
            <div className="fotos container">
                <ReactCSSTransitionGroup
                    transitionName="timeline"
                    transitionEnterTimeout={500}
                    transitionLeaveTimeout={300}>
                    {
                        this.props.fotos.map(foto => <Foto key={foto.id} foto={foto} like={this.props.like} comenta={this.props.comenta} />)
                    }
                </ReactCSSTransitionGroup>
            </div>
        );
    }
}


const mapStateToProps = state => {
    return { fotos: state.timeline }
}

const mapDispatchToProps = dispatch => {
    return {
        like: (fotoId) => {
            dispatch(TimelineApi.like(fotoId));
        },
        comentario: (fotoId, comentario) => {
            TimelineApi.comenta(fotoId, comentario);
        },
        lista: (login) => {
            dispatch(TimelineApi.lista(login));
        },
    }
}

const TimelineConatiner = connect(mapStateToProps, mapDispatchToProps)(Timeline);

export default TimelineConatiner;