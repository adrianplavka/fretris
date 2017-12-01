
import 'socket.io';
import timer = require('timers');

import { players } from './app';

export class Point {
    public x: number;
    public y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

export class Shape {
    public points: Point[]; // points that make up this shape
    public rotation = 0; // what rotation 0,1,2,3
    public fillColor: string | CanvasGradient;
    public s: string;

    constructor(s: string) {
        this.s = s;
    }

    private move(x: number, y: number): Point[] {
        var newPoints = [];

        for (var i = 0; i < this.points.length; i++) {
            newPoints.push(new Point(this.points[i].x + x, this.points[i].y + y));
        }
        return newPoints;
    }

    public setPos(newPoints: Point[]) {
        this.points = newPoints;
    }

    // return a set of points showing where this shape would be if we dropped it one
    public drop(): Point[] {
        return this.move(0, 1);
    }

    // return a set of points showing where this shape would be if we moved left one
    public moveLeft(): Point[] {
        return this.move(-1, 0);
    }

    // return a set of points showing where this shape would be if we moved right one
    public moveRight(): Point[] {
        return this.move(1, 0);
    }

    // override these
    // return a set of points showing where this shape would be if we rotate it
    public rotate(clockwise: boolean): Point[] {
        throw new Error("This method is abstract");
    }
}


export class SquareShape extends Shape {
    constructor(cols: number, s: string) {
        super(s);
        this.fillColor = '#1dcd9f';
        var x = cols / 2;
        var y = -2;
        this.points = [];
        this.points.push(new Point(x, y));
        this.points.push(new Point(x + 1, y));
        this.points.push(new Point(x, y + 1));
        this.points.push(new Point(x + 1, y + 1));
    }

    public rotate(clockwise: boolean): Point[] {
        // this shape does not rotate
        return this.points;
    }
}

export class LShape extends Shape {
    public leftHanded: boolean;

    constructor(leftHanded: boolean, cols: number, s: string) {
        super(s);
        this.leftHanded = leftHanded;
        if (leftHanded)
            this.fillColor = '#ff395e';
        else
            this.fillColor = '#0fc9e7';

        var x = cols / 2;
        var y = -2;
        this.points = [];

        this.points.push(new Point(x, y - 1));
        this.points.push(new Point(x, y)); // 1 is our base point
        this.points.push(new Point(x, y + 1));
        this.points.push(new Point(x + (leftHanded ? -1 : 1), y + 1));
    }

    public rotate(clockwise: boolean): Point[] {
        this.rotation = (this.rotation + (clockwise ? 1 : -1)) % 4;
        var newPoints = [];
        switch (this.rotation) {
            case 0:
                newPoints.push(new Point(this.points[1].x, this.points[1].y - 1));
                newPoints.push(new Point(this.points[1].x, this.points[1].y));
                newPoints.push(new Point(this.points[1].x, this.points[1].y + 1));
                newPoints.push(new Point(this.points[1].x + (this.leftHanded ? -1 : 1), this.points[1].y + 1));
                break;
            case 1:
                newPoints.push(new Point(this.points[1].x + 1, this.points[1].y));
                newPoints.push(new Point(this.points[1].x, this.points[1].y));
                newPoints.push(new Point(this.points[1].x - 1, this.points[1].y));
                newPoints.push(new Point(this.points[1].x - 1, this.points[1].y + (this.leftHanded ? -1 : 1)));
                break;
            case 2:
                newPoints.push(new Point(this.points[1].x, this.points[1].y + 1));
                newPoints.push(new Point(this.points[1].x, this.points[1].y));
                newPoints.push(new Point(this.points[1].x, this.points[1].y - 1));
                newPoints.push(new Point(this.points[1].x + (this.leftHanded ? 1 : -1), this.points[1].y - 1));
                break;
            case 3:
                newPoints.push(new Point(this.points[1].x - 1, this.points[1].y));
                newPoints.push(new Point(this.points[1].x, this.points[1].y));
                newPoints.push(new Point(this.points[1].x + 1, this.points[1].y));
                newPoints.push(new Point(this.points[1].x + 1, this.points[1].y + (this.leftHanded ? 1 : -1)));
                break;
        }
        return newPoints;
    }
}

export class StepShape extends Shape {
    public leftHanded: boolean;

    constructor(leftHanded: boolean, cols: number, s: string) {
        super(s);
        if (leftHanded)
            this.fillColor = '#3e4377';
        else
            this.fillColor = '#e9007f';

        this.leftHanded = leftHanded;
        var x = cols / 2;
        var y = -1;

        this.points = [];
        this.points.push(new Point(x + (leftHanded ? 1 : -1), y));
        this.points.push(new Point(x, y)); // point 1 is our base point
        this.points.push(new Point(x, y - 1));
        this.points.push(new Point(x + (leftHanded ? -1 : 1), y - 1));
    }


    public rotate(clockwise: boolean): Point[] {
        this.rotation = (this.rotation + (clockwise ? 1 : -1)) % 2;

        var newPoints = [];

        switch (this.rotation) {
            case 0:
                newPoints.push(new Point(this.points[1].x + (this.leftHanded ? 1 : -1), this.points[1].y));
                newPoints.push(new Point(this.points[1].x, this.points[1].y));
                newPoints.push(new Point(this.points[1].x, this.points[1].y - 1));
                newPoints.push(new Point(this.points[1].x + (this.leftHanded ? -1 : 1), this.points[1].y - 1));
                break;
            case 1:
                newPoints.push(new Point(this.points[1].x, this.points[1].y + (this.leftHanded ? 1 : -1)));
                newPoints.push(new Point(this.points[1].x, this.points[1].y));
                newPoints.push(new Point(this.points[1].x + 1, this.points[1].y));
                newPoints.push(new Point(this.points[1].x + 1, this.points[1].y + (this.leftHanded ? -1 : 1)));
                break;
        }
        return newPoints;
    }
}

export class StraightShape extends Shape {
    constructor(cols: number, s: string) {
        super(s);
        this.fillColor = '#4a2c2c';
        var x = cols / 2;
        var y = -2;
        this.points = [];
        this.points.push(new Point(x, y - 2));
        this.points.push(new Point(x, y - 1));
        this.points.push(new Point(x, y)); // point 2 is our base point
        this.points.push(new Point(x, y + 1));
    }

    public rotate(clockwise: boolean): Point[] {
        this.rotation = (this.rotation + (clockwise ? 1 : -1)) % 2;
        var newPoints = [];
        switch (this.rotation) {
            case 0:
                newPoints[0] = new Point(this.points[2].x, this.points[2].y - 2);
                newPoints[1] = new Point(this.points[2].x, this.points[2].y - 1);
                newPoints[2] = new Point(this.points[2].x, this.points[2].y);
                newPoints[3] = new Point(this.points[2].x, this.points[2].y + 1);
                break;
            case 1:
                newPoints[0] = new Point(this.points[2].x + 2, this.points[2].y);
                newPoints[1] = new Point(this.points[2].x + 1, this.points[2].y);
                newPoints[2] = new Point(this.points[2].x, this.points[2].y);
                newPoints[3] = new Point(this.points[2].x - 1, this.points[2].y);
                break;
        }
        return newPoints;
    }
}

export class TShape extends Shape {
    constructor(cols: number, s: string) {
        super(s);
        this.fillColor = '#ffd05b';
        this.points = [];
        var x = cols / 2;
        var y = -2;
        this.points.push(new Point(x - 1, y));
        this.points.push(new Point(x, y)); // point 1 is our base point
        this.points.push(new Point(x + 1, y));
        this.points.push(new Point(x, y + 1));
    }

    public rotate(clockwise: boolean): Point[] {
        this.rotation = (this.rotation + (clockwise ? 1 : -1)) % 4;
        var newPoints = [];
        switch (this.rotation) {
            case 0:
                newPoints.push(new Point(this.points[1].x - 1, this.points[1].y));
                newPoints.push(new Point(this.points[1].x, this.points[1].y));
                newPoints.push(new Point(this.points[1].x + 1, this.points[1].y));
                newPoints.push(new Point(this.points[1].x, this.points[1].y + 1));
                break;
            case 1:
                newPoints.push(new Point(this.points[1].x, this.points[1].y - 1));
                newPoints.push(new Point(this.points[1].x, this.points[1].y));
                newPoints.push(new Point(this.points[1].x, this.points[1].y + 1));
                newPoints.push(new Point(this.points[1].x - 1, this.points[1].y));
                break;
            case 2:
                newPoints.push(new Point(this.points[1].x + 1, this.points[1].y));
                newPoints.push(new Point(this.points[1].x, this.points[1].y));
                newPoints.push(new Point(this.points[1].x - 1, this.points[1].y));
                newPoints.push(new Point(this.points[1].x, this.points[1].y - 1));
                break;
            case 3:
                newPoints.push(new Point(this.points[1].x, this.points[1].y + 1));
                newPoints.push(new Point(this.points[1].x, this.points[1].y));
                newPoints.push(new Point(this.points[1].x, this.points[1].y - 1));
                newPoints.push(new Point(this.points[1].x + 1, this.points[1].y));
                break;
        }
        return newPoints;
    }
}

export class Grid {
    private rows: number;
    public cols: number;
    public blockSize: number;
    private blockColor: any[][];
    public backColor: any;
    private xOffset: number;
    private yOffset: number;

    constructor(rows: number, cols: number, blockSize: number) {
        this.blockSize = blockSize;
        this.blockColor = new Array(rows);
        this.cols = cols;
        this.rows = rows;
        for (var r = 0; r < rows; r++) {
            this.blockColor[r] = new Array(cols);
        }
        this.xOffset = 20;
        this.yOffset = 20;
    }

    public draw(shape: Shape) {
        this.paintShape(shape, shape.fillColor);
    }

    public erase(shape: Shape) {
        this.paintShape(shape, this.backColor);
    }

    private paintShape(shape: Shape, color: any) {
        shape.points.forEach(p => this.paintSquare(p.y, p.x, color));
    }

    public getPreferredSize(): Point {
        return new Point(this.blockSize * this.cols, this.blockSize * this.rows);
    }

    // check the set of points to see if they are all free
    public isPosValid(points: Point[]) {
        var valid: boolean = true;
        for (var i = 0; i < points.length; i++) {
            if ((points[i].x < 0) ||
                (points[i].x >= this.cols) ||
                (points[i].y >= this.rows)) {
                valid = false;
                break;
            }
            if (points[i].y >= 0) {
                if (this.blockColor[points[i].y][points[i].x] != this.backColor) {
                    valid = false;
                    break;
                }
            }
        }
        return valid;
    }

    public addShape(shape: Shape) {
        for (var i = 0; i < shape.points.length; i++) {
            if (shape.points[i].y < 0) {
                // a block has landed and it isn't even fully on the grid yet
                return false;
            }
            this.blockColor[shape.points[i].y][shape.points[i].x] = shape.fillColor;
        }
        return true;
    }

    public eraseGrid() {
        var width = this.cols * this.blockSize;
        var height = this.rows * this.blockSize;
    }

    public clearGrid() {
        for (var row = 0; row < this.rows; row++) {
            for (var col = 0; col < this.cols; col++) {
                this.blockColor[row][col] = this.backColor;
            }
        }
        this.eraseGrid();
    }

    private paintSquare(row: any, col: any, color: string | CanvasGradient) {
    }

    public drawGrid() {
        for (var row = 0; row < this.rows; row++) {
            for (var col = 0; col < this.cols; col++) {
                if (this.blockColor[row][col] !== this.backColor) {
                    this.paintSquare(row, col, this.blockColor[row][col]);
                }
            }
        }
    }

    public paint() {
        this.eraseGrid();
        this.drawGrid();
    }

    // only the rows in last shape could have been filled
    public checkRows(lastShape: Shape) {
        var rowMin = lastShape.points[0].y;
        var rowMax = lastShape.points[0].y;
        var rowComplete;
        var rowsRemoved = 0;
        for (var i = 1; i < lastShape.points.length; i++) {
            if (lastShape.points[i].y < rowMin) {
                rowMin = lastShape.points[i].y;
            }
            if (lastShape.points[i].y > rowMax) {
                rowMax = lastShape.points[i].y;
            }
        }
        if (rowMin < 0) {
            rowMin = 0;
        }

        while (rowMax >= rowMin) {
            rowComplete = true;
            for (var col = 0; col < this.cols; col++) {
                if (this.blockColor[rowMax][col] == this.backColor) {
                    rowComplete = false;
                    break;
                }
            }
            if (rowComplete) {
                rowsRemoved++;
                // shuffle down, stay on this row
                for (var r = rowMax; r >= 0; r--) {
                    for (col = 0; col < this.cols; col++) {
                        if (r > 0)
                            this.blockColor[r][col] = this.blockColor[r - 1][col];
                        else
                            this.blockColor[r][col] = this.backColor;
                    }
                }
                rowMin++;
            }
            else {
                // move up a row
                rowMax--;
            }
        }

        if (rowsRemoved > 0) {
            this.eraseGrid();
            this.paint();
        }
        return rowsRemoved;
    }
}

export class Game {
    private id: string;
    private io: SocketIO.Namespace;

    public player1: { id: string, name: string };
    public player2: { id: string, name: string };

    private currentShape: Shape;
    private nextShape: Shape;
    private grid: Grid;
    private nextGrid: Grid;
    private speed: number; // in milliseconds
    private level: number;
    private rowsCompleted: number;
    static gameState = { initial: 0, playing: 1, paused: 2, gameover: 3 };
    private phase = Game.gameState.initial;
    private score: number;
    private randomShapes: string[] = [];
    private timerToken: NodeJS.Timer;
    private running: boolean = false;

    constructor(id: string, io: SocketIO.Namespace) {
        this.io = io;
        this.id = id;
        this.speed = 1000;
        this.grid = new Grid(16, 10, 20);

        this.io.on("connection", (sck) => {
            console.log("someone joined the game of id", this.id);
            if (!this.player1) {
                // Set the first player.
                this.player1 = { id: sck.id, name: players.get(sck.id) };
            } else if (!this.player2) {
                // Set the second player & start the game.
                this.player2 = { id: sck.id, name: players.get(sck.id) };
                this.startGame();
            } else {
                // Can't join a full room.
                sck.disconnect();
            }

            sck.on("move", (move: string) => {
                var points: Point[] = [];
                switch (move) {
                    case "right":
                        points = this.currentShape.moveRight();
                        break;
                    case "left":
                        points = this.currentShape.moveLeft();
                        break;
                    case "up":
                        points = this.currentShape.rotate(true);
                        break;
                    case "down":
                        points = this.currentShape.drop();
                        break;
                }
                if (this.grid.isPosValid(points)) {
                    if (move === "down") {
                        clearTimeout(this.timerToken);
                        this.timerToken = setInterval(() => {
                            this.gameTimer();
                        }, this.speed);
                    }

                    this.currentShape.setPos(points);
                    io.emit("move", move);
                }
            });

            sck.on("start game", () => {
                this.startGame();
            });

            sck.on("toggle pause", () => {
                this.togglePause();
            });

            sck.on("increment level", () => {
                this.incrementLevel();
                clearTimeout(this.timerToken);
                this.timerToken = setInterval(() => {
                    this.gameTimer();
                }, this.speed);
            });
        });
    }

    private startGame() {
        this.grid.clearGrid();
        this.currentShape = this.newShape();
        this.nextShape = this.newShape();

        this.score = 0;
        this.rowsCompleted = 0;
        this.level = -1;
        this.speed = 1000;
        this.phase = Game.gameState.playing;
        this.randomShapes = [];

        this.incrementLevel();
        this.io.emit("start game", { currentShape: this.currentShape.s, nextShape: this.nextShape.s });
        clearTimeout(this.timerToken);
        this.timerToken = setInterval(() => {
            this.gameTimer();
        }, this.speed);
    }

    private gameTimer() {
        if (this.phase == Game.gameState.playing) {
            var points = this.currentShape.drop();
            if (this.grid.isPosValid(points)) {
                this.currentShape.setPos(points);
                this.io.emit("tick");
            }
            else {
                this.shapeFinished();
            }
        }
    }

    private shapeFinished() {
        if (this.grid.addShape(this.currentShape)) {
            this.grid.draw(this.currentShape);
            const completed = this.grid.checkRows(this.currentShape); // and erase them
            this.rowsCompleted += completed;
            this.score += (completed * (this.level + 1) * 10);

            if (this.rowsCompleted > ((this.level + 1) * 10)) {
                this.incrementLevel();
            }

            this.currentShape = this.nextShape;
            this.nextShape = this.newShape();
            this.io.emit("shape finished", this.nextShape.s);
            this.io.emit("score", this.score);
        }
        else {
            // Game over!
            this.phase = Game.gameState.gameover;
            clearTimeout(this.timerToken);
        }
    }

    private incrementLevel() {
        this.level++;
        if (this.level < 10) {
            this.speed = 1000 - (this.level * 100);
        }
        clearTimeout(this.timerToken);
        this.timerToken = setInterval((function (self) {
            return function () { self.gameTimer(); };
        })(this), this.speed);
    }

    private togglePause() {
        if (this.phase == Game.gameState.paused) {
            this.phase = Game.gameState.playing;
        }
        else if (this.phase == Game.gameState.playing) {
            this.phase = Game.gameState.paused;
        }
    }

    private newShape() {
        if (this.randomShapes.length === 0) {
            this.randomShapes = [
                'L', 'L', 'L', 'L',
                'LR', 'LR', 'LR', 'LR',
                'T', 'T', 'T', 'T',
                'SS', 'SS', 'SS', 'SS',
                'SZ', 'SZ', 'SZ', 'SZ',
                'S', 'S', 'S', 'S',
                'I', 'I', 'I', 'I'
            ];
        }

        var randomIndex = Math.floor(Math.random() * this.randomShapes.length - 1);
        var newShape: string | Shape = this.randomShapes.splice(randomIndex, 1)[0];
        switch (newShape) {
            case 'L':
                newShape = new LShape(false, this.grid.cols, 'L');
                break;
            case 'LR':
                newShape = new LShape(true, this.grid.cols, 'LR');
                break;
            case 'T':
                newShape = new TShape(this.grid.cols, 'T');
                newShape.setPos(newShape.rotate(true));
                break;
            case 'SS':
                newShape = new StepShape(false, this.grid.cols, 'SS');
                break;
            case 'SZ':
                newShape = new StepShape(true, this.grid.cols, 'SZ');
                break;
            case 'S':
                newShape = new SquareShape(this.grid.cols, 'S');
                break;
            case 'I':
                newShape = new StraightShape(this.grid.cols, 'I');
                newShape.setPos(newShape.rotate(true));
                break;
            default:
                newShape = new LShape(false, this.grid.cols, 'L');
                break;
        }
        return newShape;
    }
}
