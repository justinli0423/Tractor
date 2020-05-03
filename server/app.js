const express = require('express');
const socketIo = require('socket.io');
const http = require('http');
const constants = require('./constants');

// const Game = require('./game/game');
// const Round = require('./game/round');
// const Deck = require('./game/deck');
// const Card = require('./game/cards');
//
// const trumpValue = '2'
// const trumpSuit = 'S'
//
// card1 = new Card('B', 'J')
// card2 = new Card('2', 'S')
// card3 = new Card('2', 'D')
// card4 = new Card('K', 'S')
//
// console.log(card1, card1.getRank(trumpValue, trumpSuit))
// console.log(card2, card2.getRank(trumpValue, trumpSuit))
// console.log(card3, card3.getRank(trumpValue, trumpSuit))
// console.log(card4, card4.getRank(trumpValue, trumpSuit))

const index = require('./routes/index');
const SocketUtil = require('./sockets/socketUtils');
const port = process.env.PORT || 8000;

const app = express();
app.use(index);

const server = http.createServer(app);
const io = socketIo(server, { reconnect: false });
const su = new SocketUtil(io);
constants.io = io;
constants.su = su;

io.on('connection', (socket) => {
    su.addSocket(socket);
    // emit tester
    var event = null;
    socket.on(event, () => {
        console.log("event emits")
    })

    su.removeSocket(socket)

    if (constants.interval) {
        clearInterval(constants.interval);
    }
})

server.listen(port, () => {
    console.log(`Listening on port: ${port}`);
});

exports.io = io