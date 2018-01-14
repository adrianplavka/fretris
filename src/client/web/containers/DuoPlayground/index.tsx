
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

class DuoPlaygroundComponent extends React.Component<DuoPlayground.Props, {}> {
    componentDidMount() {
        const connection = new GameConnection(this.props.id);
        const myGame = new Tetris(connection.sck, true);
        const otherGame = new Tetris(connection.sck, false);

        connection.sck.on("start game", (start, id) => {
            if (connection.sck.id === id) {
                myGame.newGame(start.currentShape, start.nextShape);
            } else {
                otherGame.newGame(start.currentShape, start.nextShape);
            }
        });

        connection.sck.on("move", (move: string, id: str) => {
            if (connection.sck.id === id) {
                var points: Point[] = [];
                switch (move) {
                    case "right":
                        points = myGame.currentShape.moveRight();
                        break;
                    case "left":
                        points = myGame.currentShape.moveLeft();
                        break;
                    case "up":
                        points = myGame.currentShape.rotate(true);
                        break;
                    case "down":
                        points = myGame.currentShape.drop();
                        break;
                }
                if (myGame.grid.isPosValid(points)) {
                    myGame.currentShape.setPos(points);
                }
            } else {
                var points: Point[] = [];
                switch (move) {
                    case "right":
                        points = otherGame.currentShape.moveRight();
                        break;
                    case "left":
                        points = otherGame.currentShape.moveLeft();
                        break;
                    case "up":
                        points = otherGame.currentShape.rotate(true);
                        break;
                    case "down":
                        points = otherGame.currentShape.drop();
                        break;
                }
                if (otherGame.grid.isPosValid(points)) {
                    otherGame.currentShape.setPos(points);
                }
            }
        });

        connection.sck.on("tick", (id: str) => {
            if (connection.sck.id === id) {
                myGame.currentShape.setPos(myGame.currentShape.drop());
            } else {
                otherGame.currentShape.setPos(otherGame.currentShape.drop());
            }
        });

        connection.sck.on("shape finished", (shape, id) => {
            if (connection.sck.id === id) {
                myGame.shapeFinished(shape);
            } else {
                otherGame.shapeFinished(shape);
            }
        });

        connection.sck.on("score", (score) => {
            store.dispatch(setScore(score));
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
                        <h2 className="playground-score">Score: {this.props.score}</h2>
                        {this.props.pause ? <h2 className="playground-pause animated infinite pulse">Paused!</h2> : ""}
                    </div>
                    <canvas id="myGameCanvas" width="240" height="360"></canvas>
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

export const DuoPlayground = connect(mapStateToProps, mapDispatchToProps)(DuoPlaygroundComponent);
