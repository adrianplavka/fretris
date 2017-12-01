
import * as React from 'react';
import { connect } from 'react-redux';
import { GameConnection } from '../../network';

import { DuoGame as Tetris } from '../../game';
import { RootState } from '../../reducers/store';
import './styles.css';

namespace DuoPlayground {
    export interface OwnProps {
        username: str
        id: str;
    }

    export interface StateProps {
        score: number;
    }

    export type Props = OwnProps & StateProps;
}

function mapStateToProps(state: RootState) {
    return {
        score: state.playground.score
    };
}

function mapDispatchToProps(dispatch: any) {
    return {

    };
}

class DuoPlaygroundComponent extends React.Component<DuoPlayground.Props, {}> {
    componentDidMount() {
        const connection = new GameConnection(this.props.id);
        const game = new Tetris(connection.sck);
    }

    render() {
        return (
            <div className="container animated fadeIn">
                <div className="playground-header">
                    <h1 className="playground-title animated infinite pulse">
                        Fretris!
                    </h1>
                    <h3 className="playground-mode">
                        Duo Mode
                    </h3>
                </div>
                <h3 className="playground-id">ID: {this.props.id}</h3>
                <div className="playground">
                    <canvas id="gameCanvas" width="240" height="360"></canvas>
                    <div className="playground-viewbar">
                        <canvas id="nextCanvas" width="135" height="135"></canvas>
                        <h2 className="playground-score">Score: {this.props.score}</h2>
                    </div>
                </div>
            </div>
        );
    }
}

export const DuoPlayground = connect(mapStateToProps, mapDispatchToProps)(DuoPlaygroundComponent);
