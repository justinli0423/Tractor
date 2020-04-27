const express = require('express');
const socketIo = require('socket.io');
const http = require('http');
const constants = require('./constants');

// const Game = require('./game/game');
// const Round = require('./game/round');
// const Deck = require('./game/deck');
// const Card = require('./game/cards');
const index = require('./routes/index');
const SocketUtil = require('./sockets/socketUtils');
const port = process.env.PORT || 8000;

const app = express();
app.use(index);

const server = http.createServer(app);
const io = socketIo(server);
const su = new SocketUtil(io);
constants.io = io;
constants.su = su;
global.interval = null;


io.on('connection', (socket) => {
    su.addSocket(socket)

    // emit tester
    var event = null;
    socket.on(event, () => {
        console.log("event emits")
    })

    su.removeSocket(socket)

    if (global.interval) {
        clearInterval(global.interval);
    }
})

server.listen(port, () => {
    console.log(`Listening on port: ${port}`);
});

exports.io = io