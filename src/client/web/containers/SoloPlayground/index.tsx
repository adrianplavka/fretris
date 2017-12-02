
import * as React from 'react';
import { connect } from 'react-redux';

import { SoloGame as Tetris } from '../../game/index';
import { RootState } from '../../reducers/store';
import './styles.css';

namespace SoloPlayground {
    export interface StateProps {
        score: number;
        pause: bool;
    }

    export type Props = StateProps;
}

function mapStateToProps(state: RootState) {
    return {
        score: state.playground.score,
        pause: state.playground.pause
    };
}

function mapDispatchToProps(dispatch: any) {
    return {};
}

class SoloPlaygroundComponent extends React.Component<SoloPlayground.Props, {}> {
    componentDidMount() {
        const game = new Tetris();
        game.newGame();
    }

    render() {
        return (
            <div className="container animated fadeIn">
                <div className="playground-header">
                    <h1 className="playground-title animated infinite pulse">
                        Fretris!
                    </h1>
                    <h3 className="playground-mode">
                        Solo Mode
                    </h3>
                </div>
                <div className="playground">
                    <canvas id="gameCanvas" width="240" height="360"></canvas>
                    <div className="playground-viewbar">
                        <canvas id="nextCanvas" width="135" height="135"></canvas>
                        <h2 className="playground-score">Score: {this.props.score}</h2>
                        {this.props.pause ? <h2 className="playground-pause">Paused!</h2> : ""}
                    </div>
                </div>
            </div>
        );
    }
}

export const SoloPlayground = connect(mapStateToProps, mapDispatchToProps)(SoloPlaygroundComponent);
