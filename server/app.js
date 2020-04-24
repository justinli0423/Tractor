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
// io.global.sockets.connected[socketId] to get ID
// io.to(socketid).emit(); to send to specific client
global.sockets = {};
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

// const getCard = socket => {
//     if (deck.isEmpty()) {
//         clearInterval(interval);
//         return;
//     }
//     const card = deck.deal();
//     socket.emit('DealCard', [card.value, card.suit]);
// }

const getConnectionStatus = socket => {
    socket.emit('connectionStatus', socket.connected);
}

const trackClients = (socketId, userId) => {
    numClients += 1;
    console.log(`Client #${numClients} (${userId}) has connected`);
    console.log(0, global.sockets)
    global.sockets[socketId] = userId;
    console.log(1, global.sockets)
}

const removeClient = (socket) => {
    console.log(`Client ${global.sockets[socket.id]} has disconnected`);
    global.sockets[socket.id] = null;
    numClients -= 1;
}

io.on('connection', (socket) => {

    getConnectionStatus(socket);
    getSocketID(socket);

    if (interval) {
        clearInterval(interval);    
    }

    if (numClients === 4) {
    //     interval = setInterval(() => {
    //         getCard(global.sockets[curuser]);
    //         curuser = 1 - curuser;
    //     }, 5);
        console.log(global.sockets)
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

