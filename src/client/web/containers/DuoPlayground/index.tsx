
import * as React from 'react';
import { connect } from 'react-redux';
import { GameConnection } from '../../network';

import { setScore, setPause } from '../../actions/playground';
import { store } from '../../index';
import { DuoGame as Tetris, Point } from '../../game';
import { RootState } from '../../reducers/store';
import { mobileCheck } from '../../utils';
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

    export interface State {
        myScore: number;
        otherScore: number;
    }
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
    private connection: GameConnection;
    private myGame: Tetris;
    private otherGame: Tetris;
    private isMobile: bool;

    constructor(props: DuoPlayground.Props) {
        super(props);
        this.state = { myScore: 0, otherScore: 0 };
        this.connection = new GameConnection(this.props.id);
        this.isMobile = mobileCheck();
    }

    componentDidMount() {
        this.myGame = new Tetris(this.connection.sck, true);
        this.otherGame = new Tetris(this.connection.sck, false);

        this.connection.sck.on("start game", (start, id) => {
            const game = this.connection.sck.id === id ? this.myGame : this.otherGame;
            game.newGame(start.currentShape, start.nextShape);
        });

        this.connection.sck.on("move", (move: string, id: str) => {
            const game = this.connection.sck.id === id ? this.myGame : this.otherGame;

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

        this.connection.sck.on("tick", (id: str) => {
            const game = this.connection.sck.id === id ? this.myGame : this.otherGame;
            game.currentShape.setPos(game.currentShape.drop());
        });

        this.connection.sck.on("shape finished", (shape, id) => {
            const game = this.connection.sck.id === id ? this.myGame : this.otherGame;
            game.shapeFinished(shape);
        });

        this.connection.sck.on("score", (score, id) => {
            if (this.connection.sck.id === id) {
                this.setState({ ...this.state, myScore: score });
            } else {
                this.setState({ ...this.state, otherScore: score });
            }
        });

        this.connection.sck.on("pause", () => {
            store.dispatch(setPause(true));
        });

        this.connection.sck.on("unpause", () => {
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
