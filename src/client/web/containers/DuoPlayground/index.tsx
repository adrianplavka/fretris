
import * as React from 'react';
import { connect } from 'react-redux';
import { GameConnection } from '../../network';
import * as Hammer from 'hammerjs';

import { setScore, setPause } from '../../actions/playground';
import { store } from '../../index';
import { DuoGame as Tetris, Point } from '../../game';
import { RootState } from '../../reducers/store';
import { isMobile } from '../../utils';
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
        myTetrisNotify: JSX.Element;
        otherTetrisNotify: JSX.Element;
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
    private swipeDelay: number = 0;
    private readonly swipeDelayMax: number = 3;
    private swipeAction: number;
    private mc: HammerManager;

    constructor(props: DuoPlayground.Props) {
        super(props);
        this.state = { 
            myScore: 0, 
            otherScore: 0, 
            myTetrisNotify: null, 
            otherTetrisNotify: null 
        };
        this.connection = new GameConnection(this.props.id);
        this.myTetrisNotify = this.myTetrisNotify.bind(this);
        this.otherTetrisNotify = this.otherTetrisNotify.bind(this);
    }

    componentDidMount() {
        this.myGame = new Tetris(this.connection.sck, true, this.myTetrisNotify);
        this.otherGame = new Tetris(this.connection.sck, false, this.otherTetrisNotify);
        
        this.setupSwipe();

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
                <div id="duo-playground">
                    <div className="playground-header">
                        <div className="playground-header-title">
                            <h1 className="playground-title animated infinite pulse">
                                Fretris!
                            </h1>
                            <h3 className="playground-mode">
                                Duo Mode
                            </h3>
                        </div>
                        <h3 className="playground-id">ID: {this.props.id}</h3>
                    </div>
                    <div className="playground">
                        <div id="playground-me">
                            <div className="playground-viewbar">
                                <canvas id="myNextCanvas" width="135" height="135"></canvas>
                                <h2 className="playground-score">Score: {this.state.myScore}</h2>
                                {this.props.pause ? <h2 className="playground-pause animated infinite pulse">Paused!</h2> : ""}
                            </div>
                            <canvas id="myGameCanvas" width="240" height="360"></canvas>
                            {this.state.myTetrisNotify}
                        </div>
                        <div id="playground-other">
                            <canvas id="gameCanvas" width="240" height="360"></canvas>
                            <div className="playground-viewbar">
                                <canvas id="nextCanvas" width="135" height="135"></canvas>
                                <h2 className="playground-score">Score: {this.state.otherScore}</h2>
                                {this.props.pause ? <h2 className="playground-pause animated infinite pulse">Paused!</h2> : ""}
                            </div>
                            {this.state.otherTetrisNotify}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    componentWillUnmount() {
        this.mc.destroy();
        this.connection.sck.disconnect();
    }

    setupSwipe() {
        if (isMobile()) {
            this.mc = new Hammer.Manager(document.getElementById("root"), {});
            this.mc.add(new Hammer.Pan({ direction: Hammer.DIRECTION_ALL, threshold: 10, posThreshold: 300 }));
            this.mc.add(new Hammer.Tap());

            this.mc.on('pan', (ev) => {
                switch (ev.direction) {
                    case Hammer.DIRECTION_LEFT:
                        if (this.swipeDelay >= this.swipeDelayMax && this.swipeAction == Hammer.DIRECTION_LEFT) {
                            this.connection.sck.emit("move", "left");
                            this.swipeDelay = 0;
                        }
                        this.swipeAction = Hammer.DIRECTION_LEFT;
                        this.swipeDelay++;
                        break;
                    case Hammer.DIRECTION_RIGHT:
                        if (this.swipeDelay >= this.swipeDelayMax && this.swipeAction == Hammer.DIRECTION_RIGHT) {
                            this.connection.sck.emit("move", "right");
                            this.swipeDelay = 0;
                        }
                        this.swipeAction = Hammer.DIRECTION_RIGHT;
                        this.swipeDelay++;
                        break;
                    default:
                        if (this.swipeDelay >= this.swipeDelayMax && this.swipeAction == Hammer.DIRECTION_DOWN) {
                            this.connection.sck.emit("move", "down");
                            this.swipeDelay = 0;
                        }
                        this.swipeAction = Hammer.DIRECTION_DOWN;
                        this.swipeDelay++;
                        break;
                }
            });

            this.mc.on('tap', (ev) => {
                this.connection.sck.emit("move", "up");
            });
        }
    }

    myTetrisNotify() {
        this.setState({ 
            ...this.state, 
            myTetrisNotify:
                <div className="animated playground-notify"><p unselectable>Fretris!</p></div>
        });
        setTimeout(() => {
            this.setState({
                ...this.state,
                myTetrisNotify: null
            });
        }, 1500);
    }

    otherTetrisNotify() {
        this.setState({ 
            ...this.state, 
            otherTetrisNotify:
                <div className="animated playground-notify"><p unselectable>Fretris!</p></div>
        });
        setTimeout(() => {
            this.setState({
                ...this.state,
                otherTetrisNotify: null
            });
        }, 1500);
    }
}

export const DuoPlayground = connect(mapStateToProps, mapDispatchToProps)(DuoPlaygroundComponent);
