const express = require('express');
const socketIo = require('socket.io');
const http = require('http');

const index = require('./routes/index');
const Game = require('./game/game');
const Round = require('./game/round');
const Deck = require('./game/deck');
const Card = require('./game/cards');
const port = process.env.PORT || 8000;

const app = express();
app.use(index);
const server = http.createServer(app);
const io = socketIo(server);
<<<<<<< HEAD
const sockets = {};

// io.sockets.connected[socketId] to get ID
// io.to(socketid).emit(); to send to specific client
let interval;

const getSocketID = socket => {
    socket.on('setSocketID', (username) => {
        socket.username = username;
        console.log(socket.username);
        return socket;
    });
=======
const sockets = [];
let interval;

var users = 0;
var curuser = 0;
// const game = new Game();
const deck = new Deck();
deck.populate()
deck.shuffle()

const getApiAndEmit = socket => {
    const response = new Date();
    socket.emit('FromApi', response);
}

const getCard = socket => {
    if (deck.isEmpty()) {
        clearInterval(interval);
        return;
    }
    const card = deck.deal();
    socket.emit('DealCard', [card.value, card.suit]);
>>>>>>> origin/master
}

const getConnectionStatus = socket => {
    socket.emit('connectionStatus', socket.connected);
}

io.on('connection', (socket) => {
    console.log('newClient ' + users);
    users += 1;
    sockets.push(socket);

<<<<<<< HEAD
    getConnectionStatus(socket);
=======
    if (interval) {
        clearInterval(interval);
    }

    if (users === 2) {
        interval = setInterval(() => {
            getCard(sockets[curuser]);
            curuser = 1 - curuser;
        }, 5);
    }

    socket.on('setSocketID', (username) => {
        console.log(username)
        socket.username = username
    });
>>>>>>> origin/master

    socket.on('disconnect', () => {
        console.log(`socket ${socket.username} disconnected`);
        clearInterval(interval);
    })
})

server.listen(port, () => {
    console.log(`Listening on port: ${port}`);
})
