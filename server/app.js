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
// io.sockets.connected[socketId] to get ID
// io.to(socketid).emit(); to send to specific client
var sockets = {};
// socket
var interval;
var numClients = 0;
var curuser = 0;
// const game = new Game();
const deck = new Deck();
deck.populate();
deck.shuffle();

const getSocketID = socket => {
    socket.on('setSocketID', (username) => {
        trackClients(socket.id, username);
    });
}

const getCard = socket => {
    if (deck.isEmpty()) {
        clearInterval(interval);
        return;
    }
    const card = deck.deal();
    socket.emit('DealCard', [card.value, card.suit]);
}

const setConnectionStatus = (socket, socketStatus = false) => {
    socket.emit('connectionStatus', socketStatus);
}

const setConnectedClients = (sockets) => {
    // console.log(sockets);
    // TODO: DELETE NULL CLIENTS USING UNDERSCORE
    console.log('Total clients:', Object.values(sockets));
    io.emit('newClientConnection', sockets);
}

const trackClients = (socketId, userId) => {
    console.log(`Client ${userId} has connected`);
    numClients += 1;
    sockets[socketId] = userId;
    setConnectedClients(sockets);
}

const removeClient = (socket) => {
    console.log(`Client ${sockets[socket.id]} has disconnected`);
    setConnectionStatus(socket);
    sockets[socket.id] = null;
    numClients -= 1;
}

io.on('connection', (socket) => {

    setConnectionStatus(socket, socket.connected);
    getSocketID(socket);

    if (interval) {
        clearInterval(interval);    
    }

    if (numClients === 2) {
        interval = setInterval(() => {
            getCard(sockets[curuser]);
            curuser = 1 - curuser;
        }, 5);
    }

    socket.on('setSocketID', (username) => {
        socket.username = username
    });

    socket.on('disconnect', () => {
        clearInterval(interval);
        removeClient(socket);
    })
})

server.listen(port, () => {
    console.log(`Listening on port: ${port}`);
});

