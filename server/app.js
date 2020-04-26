const express = require('express');
const socketIo = require('socket.io');
const http = require('http');

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
global.io = socketIo(server);
global.su = new SocketUtil(io);

global.interval = null;

io.on('connection', (socket) => {
    su.addSocket(socket)
    su.removeSocket(socket)

    if (global.interval) {
        clearInterval(global.interval);
    }
})

server.listen(port, () => {
    console.log(`Listening on port: ${port}`);
});

