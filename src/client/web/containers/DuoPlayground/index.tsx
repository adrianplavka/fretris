
import * as React from 'react';
import { connect } from 'react-redux';
import { GameConnection } from '../../network';

import { setScore, setPause } from '../../actions/playground';
import { store } from '../../index';
import { DuoGame as Tetris, Point } from '../../game';
import { RootState } from '../../reducers/store';
import './styles.css';

namespace DuoPlayground {
    export interface OwnProps {
        username: str
        id: str;
    }

    export interface StateProps {
        score: number;
        pause: bool;
    }

    export interface State {
        myScore: number;
        otherScore: number;
    }

    export type Props = OwnProps & StateProps;
}

function mapStateToProps(state: RootState) {
    return {
        score: state.playground.score,
        pause: state.playground.pause
    };
}

function mapDispatchToProps(dispatch: any) {
    return {

    };
}

class DuoPlaygroundComponent extends React.Component<DuoPlayground.Props, DuoPlayground.State> {
    constructor(props) {
        super(props);
        this.state = { myScore: 0, otherScore: 0 };
    }

    componentDidMount() {
        const connection = new GameConnection(this.props.id);
        const myGame = new Tetris(connection.sck, true);
        const otherGame = new Tetris(connection.sck, false);

        connection.sck.on("start game", (start, id) => {
            const game = connection.sck.id === id ? myGame : otherGame;
            game.newGame(start.currentShape, start.nextShape);
        });

        connection.sck.on("move", (move: string, id: str) => {
            const game = connection.sck.id === id ? myGame : otherGame;

            var points: Point[] = [];
            switch (move) {
                case "right":
                    points = game.currentShape.moveRight();
                    break;
                case "left":
                    points = game.currentShape.moveLeft();
                    break;
                case "up":
                    points = game.currentShape.rotate(true);
                    break;
                case "down":
                    points = game.currentShape.drop();
                    break;
            }
            if (game.grid.isPosValid(points)) {
                game.currentShape.setPos(points);
            }
        });

        connection.sck.on("tick", (id: str) => {
            const game = connection.sck.id === id ? myGame : otherGame;
            game.currentShape.setPos(game.currentShape.drop());
        });

        connection.sck.on("shape finished", (shape, id) => {
            const game = connection.sck.id === id ? myGame : otherGame;
            game.shapeFinished(shape);
        });

        connection.sck.on("score", (score, id) => {
            if (connection.sck.id === id) {
                this.setState({ ...this.state, myScore: score });
            } else {
                this.setState({ ...this.state, otherScore: score });
            }
        });

        connection.sck.on("pause", () => {
            store.dispatch(setPause(true));
        });

        connection.sck.on("unpause", () => {
            store.dispatch(setPause(false));
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
                        Duo Mode
                    </h3>
                </div>
                <h3 className="playground-id">ID: {this.props.id}</h3>
                <div className="playground">
                    <div className="playground-viewbar">
                        <canvas id="myNextCanvas" width="135" height="135"></canvas>
                        <h2 className="playground-score">Score: {this.state.myScore}</h2>
                        {this.props.pause ? <h2 className="playground-pause animated infinite pulse">Paused!</h2> : ""}
                    </div>
                    <canvas id="myGameCanvas" width="240" height="360"></canvas>
                    <canvas id="gameCanvas" width="240" height="360"></canvas>
                    <div className="playground-viewbar">
                        <canvas id="nextCanvas" width="135" height="135"></canvas>
                        <h2 className="playground-score">Score: {this.state.otherScore}</h2>
                        {this.props.pause ? <h2 className="playground-pause animated infinite pulse">Paused!</h2> : ""}
                    </div>
                </div>
            </div>
        );
    }
}

export const DuoPlayground = connect(mapStateToProps, mapDispatchToProps)(DuoPlaygroundComponent);
