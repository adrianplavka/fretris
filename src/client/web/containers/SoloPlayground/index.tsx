
import * as React from 'react';
import { connect } from 'react-redux';
import * as Hammer from 'hammerjs';

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
    private swipeDelay: number = 0;
    private readonly swipeDelayMax: number = 4;
    private swipeAction: number;

    componentDidMount() {
        const game = new Tetris();
        game.newGame();

        // Setup swipe gestures.
        var mc = new Hammer.Manager(document.getElementById("root"), {});
        mc.add(new Hammer.Pan({ direction: Hammer.DIRECTION_ALL, threshold: 10, posThreshold: 300 }));
        mc.add(new Hammer.Tap());

        mc.on('pan', (ev) => {
            switch (ev.direction) {
                case Hammer.DIRECTION_LEFT:
                    if (this.swipeDelay >= this.swipeDelayMax && this.swipeAction == Hammer.DIRECTION_LEFT) {
                        game.moveLeft();
                        this.swipeDelay = 0;
                    }
                    this.swipeAction = Hammer.DIRECTION_LEFT;
                    this.swipeDelay++;
                    break;
                case Hammer.DIRECTION_RIGHT:
                    if (this.swipeDelay >= this.swipeDelayMax && this.swipeAction == Hammer.DIRECTION_RIGHT) {
                        game.moveRight();
                        this.swipeDelay = 0;
                    }
                    this.swipeAction = Hammer.DIRECTION_RIGHT;
                    this.swipeDelay++;
                    break;
                default:
                    if (this.swipeDelay >= this.swipeDelayMax && this.swipeAction == Hammer.DIRECTION_DOWN) {
                        game.moveDown();
                        this.swipeDelay = 0;
                    }
                    this.swipeAction = Hammer.DIRECTION_DOWN;
                    this.swipeDelay++;
                    break;
            }
        });

        mc.on('tap', (ev) => {
            game.rotate();
        });
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
                        {this.props.pause ? <h2 className="playground-pause animated infinite pulse">Paused!</h2> : ""}
                    </div>
                </div>
            </div>
        );
    }
}

export const SoloPlayground = connect(mapStateToProps, mapDispatchToProps)(SoloPlaygroundComponent);
