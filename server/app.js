const express = require('express');
const socketIo = require('socket.io');
const http = require('http');

const index = require('./routes/index');
const Game = require('./game/game');
const Round = require('./game/round');
const Deck = require('./game/deck');
const Card = require('./game/cards');
const SocketUtil = require('./sockets/socketUtils');
const port = process.env.PORT || 8000;

const app = express();
app.use(index);
const server = http.createServer(app);
const io = socketIo(server);
const su = new SocketUtil(io);
// io.global.sockets.connected[socketId] to get ID
// io.to(socketid).emit(); to send to specific client
global.interval = null;
var numClients = 0;
var curuser = 0;
// const game = new Game();
const deck = new Deck();
deck.populate();
deck.shuffle();

io.on('connection', (socket) => {

    su.add_socket(socket)
    su.remove_socket(socket)

    if (global.interval) {
        clearInterval(global.interval);
    }
    console.log(su.getNumClients())
    if (su.getNumClients() === 4) {
    //     interval = setInterval(() => {
    //         getCard(global.sockets[curuser]);
    //         curuser = 1 - curuser;
    //     }, 5);
        console.log(su.sockets())
    }
})

server.listen(port, () => {
    console.log(`Listening on port: ${port}`);
});

