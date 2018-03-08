/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Express = __webpack_require__(3);
const http = __webpack_require__(4);
const socket = __webpack_require__(1);
const game_1 = __webpack_require__(5);
exports.app = Express();
exports.server = http.createServer(exports.app);
exports.io = socket(exports.server);
// Serve static files.
exports.app.use(Express.static("src/client/web/.dist/"));
exports.app.get("*/bundle.js", (req, res) => {
    res.status(200).sendFile(`${process.cwd()}/src/client/web/.dist/`);
});
// Serve the index page.
exports.app.get("*", (req, res) => {
    res.status(200).sendFile(`${process.cwd()}/src/client/web/.dist/`);
});
exports.players = new Map();
const games = new Map();
exports.io.on("connection", (sck) => {
    sck.emit("connection");
    sck.on("join", (name) => {
        exports.players.set(sck.id, name);
        sck.broadcast.emit("join", name);
    });
    sck.on("chat message", (msg) => {
        exports.io.emit("chat message", { sender: exports.players.get(sck.id), msg: msg });
    });
    sck.on("check room", (id) => {
        let check = true;
        const game = games.get(id);
        if (!game || (game.player1 && game.player2)) {
            check = false;
        }
        sck.emit("check room", check);
    });
    sck.on("create room", () => {
        const id = Math.random().toString(36).substr(2, 5);
        const nsp = exports.io.of(id);
        games.set(id, new game_1.GameNamespace(id, nsp));
        sck.emit("create room", id);
    });
});


/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("socket.io");

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __webpack_require__(0);
const port = 8000;
app_1.server.listen(process.env.PORT || port);
console.log("<Tetris Online> @ Index > Started on port", port);


/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("http");

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__(1);
const app_1 = __webpack_require__(0);
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
exports.Point = Point;
class Shape {
    constructor(s) {
        this.rotation = 0; // what rotation 0,1,2,3
        this.s = s;
    }
    move(x, y) {
        var newPoints = [];
        for (var i = 0; i < this.points.length; i++) {
            newPoints.push(new Point(this.points[i].x + x, this.points[i].y + y));
        }
        return newPoints;
    }
    setPos(newPoints) {
        this.points = newPoints;
    }
    // return a set of points showing where this shape would be if we dropped it one
    drop() {
        return this.move(0, 1);
    }
    // return a set of points showing where this shape would be if we moved left one
    moveLeft() {
        return this.move(-1, 0);
    }
    // return a set of points showing where this shape would be if we moved right one
    moveRight() {
        return this.move(1, 0);
    }
    // override these
    // return a set of points showing where this shape would be if we rotate it
    rotate(clockwise) {
        throw new Error("This method is abstract");
    }
}
exports.Shape = Shape;
class SquareShape extends Shape {
    constructor(cols, s) {
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
    rotate(clockwise) {
        // this shape does not rotate
        return this.points;
    }
}
exports.SquareShape = SquareShape;
class LShape extends Shape {
    constructor(leftHanded, cols, s) {
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
    rotate(clockwise) {
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
exports.LShape = LShape;
class StepShape extends Shape {
    constructor(leftHanded, cols, s) {
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
    rotate(clockwise) {
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
exports.StepShape = StepShape;
class StraightShape extends Shape {
    constructor(cols, s) {
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
    rotate(clockwise) {
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
exports.StraightShape = StraightShape;
class TShape extends Shape {
    constructor(cols, s) {
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
    rotate(clockwise) {
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
exports.TShape = TShape;
class Grid {
    constructor(rows, cols, blockSize) {
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
    draw(shape) {
        this.paintShape(shape, shape.fillColor);
    }
    erase(shape) {
        this.paintShape(shape, this.backColor);
    }
    paintShape(shape, color) {
        shape.points.forEach(p => this.paintSquare(p.y, p.x, color));
    }
    getPreferredSize() {
        return new Point(this.blockSize * this.cols, this.blockSize * this.rows);
    }
    // check the set of points to see if they are all free
    isPosValid(points) {
        var valid = true;
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
    addShape(shape) {
        for (var i = 0; i < shape.points.length; i++) {
            if (shape.points[i].y < 0) {
                // a block has landed and it isn't even fully on the grid yet
                return false;
            }
            this.blockColor[shape.points[i].y][shape.points[i].x] = shape.fillColor;
        }
        return true;
    }
    eraseGrid() {
        var width = this.cols * this.blockSize;
        var height = this.rows * this.blockSize;
    }
    clearGrid() {
        for (var row = 0; row < this.rows; row++) {
            for (var col = 0; col < this.cols; col++) {
                this.blockColor[row][col] = this.backColor;
            }
        }
        this.eraseGrid();
    }
    paintSquare(row, col, color) {
    }
    drawGrid() {
        for (var row = 0; row < this.rows; row++) {
            for (var col = 0; col < this.cols; col++) {
                if (this.blockColor[row][col] !== this.backColor) {
                    this.paintSquare(row, col, this.blockColor[row][col]);
                }
            }
        }
    }
    paint() {
        this.eraseGrid();
        this.drawGrid();
    }
    // only the rows in last shape could have been filled
    checkRows(lastShape) {
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
exports.Grid = Grid;
class GameNamespace {
    constructor(id, io) {
        this.id = id;
        this.io = io;
        this.game1 = new Game(io);
        this.game2 = new Game(io);
        this.games = new Map();
        this.io.on("connection", (sck) => {
            if (!this.player1) {
                // Set the first player.
                this.player1 = { id: sck.id, name: app_1.players.get(sck.id) };
                this.games[sck.id] = this.game1;
                this.game1.id = sck.id;
            }
            else if (!this.player2) {
                // Set the second player & start the game.
                this.player2 = { id: sck.id, name: app_1.players.get(sck.id) };
                this.games[sck.id] = this.game2;
                this.game2.id = sck.id;
                this.game1.startGame();
                this.game2.startGame();
            }
            else {
                // Can't join a full room.
                sck.disconnect();
            }
            sck.on("move", (move) => {
                if (this.games[sck.id].phase == Game.gameState.playing) {
                    var points = [];
                    switch (move) {
                        case "right":
                            points = this.games[sck.id].currentShape.moveRight();
                            if (this.games[sck.id].grid.isPosValid(points)) {
                                this.games[sck.id].currentShape.setPos(points);
                                io.emit("move", move, sck.id);
                            }
                            break;
                        case "left":
                            points = this.games[sck.id].currentShape.moveLeft();
                            if (this.games[sck.id].grid.isPosValid(points)) {
                                this.games[sck.id].currentShape.setPos(points);
                                io.emit("move", move, sck.id);
                            }
                            break;
                        case "up":
                            points = this.games[sck.id].currentShape.rotate(true);
                            if (this.games[sck.id].grid.isPosValid(points)) {
                                this.games[sck.id].currentShape.setPos(points);
                                io.emit("move", move, sck.id);
                            }
                            break;
                        case "down":
                            points = this.games[sck.id].currentShape.drop();
                            if (this.games[sck.id].grid.isPosValid(points)) {
                                this.games[sck.id].currentShape.setPos(points);
                                io.emit("move", move, sck.id);
                            }
                            break;
                    }
                }
            });
            sck.on("start game", () => {
                this.game1.startGame();
                this.game2.startGame();
            });
            sck.on("toggle pause", () => {
                this.game1.togglePause();
                this.game2.togglePause();
            });
            sck.on("increment level", () => {
                this.game1.incrementLevel();
                this.game2.incrementLevel();
            });
        });
    }
}
exports.GameNamespace = GameNamespace;
class Game {
    constructor(io) {
        this.phase = Game.gameState.initial;
        this.randomShapes = [];
        this.running = false;
        this.io = io;
        this.speed = 1000;
        this.grid = new Grid(16, 10, 20);
    }
    startGame() {
        this.grid.clearGrid();
        this.currentShape = this.newShape();
        this.nextShape = this.newShape();
        this.score = 0;
        this.rowsCompleted = 0;
        this.level = -1;
        this.speed = 900;
        this.phase = Game.gameState.playing;
        this.randomShapes = [];
        this.incrementLevel();
        this.io.emit("start game", { currentShape: this.currentShape.s, nextShape: this.nextShape.s }, this.id);
        clearTimeout(this.timerToken);
        this.timerToken = setInterval(() => {
            this.gameTimer();
        }, this.speed);
    }
    gameTimer() {
        if (this.phase == Game.gameState.playing) {
            var points = this.currentShape.drop();
            if (this.grid.isPosValid(points)) {
                this.currentShape.setPos(points);
                this.io.emit("tick", this.id);
            }
            else {
                this.shapeFinished();
            }
        }
    }
    shapeFinished() {
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
            this.io.emit("shape finished", this.nextShape.s, this.id);
            this.io.emit("score", this.score, this.id);
        }
        else {
            // Game over!
            this.phase = Game.gameState.gameover;
            clearTimeout(this.timerToken);
        }
    }
    incrementLevel() {
        if (this.level < 7) {
            this.level++;
            this.speed -= 100;
            clearTimeout(this.timerToken);
            this.timerToken = setInterval((function (self) {
                return function () { self.gameTimer(); };
            })(this), this.speed);
        }
    }
    togglePause() {
        if (this.phase == Game.gameState.paused) {
            this.phase = Game.gameState.playing;
            this.io.emit("unpause", this.id);
        }
        else if (this.phase == Game.gameState.playing) {
            this.phase = Game.gameState.paused;
            this.io.emit("pause", this.id);
        }
    }
    newShape() {
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
        var newShape = this.randomShapes.splice(randomIndex, 1)[0];
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
Game.gameState = { initial: 0, playing: 1, paused: 2, gameover: 3 };
exports.Game = Game;


/***/ })
/******/ ]);