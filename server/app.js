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
const sockets = {};
let interval;

var i = 0
const game = new Game()
const deck = new Deck()
deck.populate()
deck.shuffle()

const getApiAndEmit = socket => {
    const response = new Date();
    socket.emit('FromApi', response);
}

const getCard = socket => {
    const card = deck.deal();
    socket.emit('DealCard', card.value, card.suit);
}

io.on('connection', (socket) => {
    console.log('newClient ' + i);
    i += 1;
    console.log('newClient');

    if (interval) {
        clearInterval(interval);
    }

    interval = setInterval(() => {
        if (deck.isEmpty()) {
            clearInterval(interval);
        }
        return getCard(socket);
    }, 1000);

    socket.on('setSocketID', (username) => {
        console.log(username)
        socket.username = username
    });

    socket.on('disconnect', () => {
        console.log('client disconnected');
        clearInterval(interval);
    })
})

server.listen(port, () => {
    console.log(`Listening on port: ${port}`);
})

