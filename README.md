
<h1 align="center">
  <a href="https://github.com/adrianplavka/fretris"><img src="icons/fretris.png" alt="Fretris" height="150"/></a><br>
  <a href="https://github.com/adrianplavka/fretris">Fretris</a>

[![CircleCI](https://circleci.com/gh/adrianplavka/fretris.svg?style=svg)](https://circleci.com/gh/adrianplavka/fretris)
</h1>

<h4 align="center">Multiplayer Tetris, built w/ React & Node.js.</h4>

This game of Tetris was written as a personal challenge and in order to spice things a little bit, it includes both solo & multiplayer game modes, in which players can try to last the longest.

Technologies include:
 - React, Redux at front-end
 - Node.js, Socket.io at back-end
 - CI/CD integration (CircleCI w/ continuous deployment into Heroku)

## Getting started

First, clone this repository & run `npm install` to install dependencies:

```bash
$ git clone https://github.com/adrianplavka/fretris-mentoring
$ cd fretris-mentoring
$ npm install
```

### Running in development mode

To run the client:

```bash
$ npm run start:client
```

***Note:*** *In order to play multiplayer mode between two players, a server has to be running.*

To run the server:

```bash
$ npm run start:server
```

### Testing

Optionally, you can test the application by running:

```bash
$ npm run test
```

