const express = require('express');
const socketIo = require('socket.io');
const http = require('http');
const constants = require('./constants');

//
// let a = [];
// console.log(a)
// a[100] = 1;
// console.log(a)
//
//
// const Trick = require('./game/trick');
// // const Round = require('./game/round');
// // const Deck = require('./game/deck');
// const Card = require('./game/cards');
// const hand1 = [
//     new Card('B', 'J'),
//     new Card('S', 'J'),
//     new Card('2', 'S'),
//     new Card('2', 'D'),
//     new Card('2', 'H'),
//     new Card('A', 'S'),
//     new Card('K', 'S'),
//     new Card('Q', 'S'),
//     new Card('J', 'S'),
//     new Card('10', 'S'),
//     new Card('9', 'S'),
//     new Card('8', 'S'),
//     new Card('7', 'S'),
//     new Card('6', 'S'),
//     new Card('5', 'S'),
//     new Card('4', 'S'),
//     new Card('3', 'S')
// ]
// const hand2 = [
//     new Card('B', 'J'),
//     new Card('S', 'J'),
//     new Card('2', 'S'),
//     new Card('A', 'S'),
//     new Card('K', 'S'),
//     new Card('Q', 'S')
// ]
// const hand3 = [
//     new Card('B', 'J'),
//     new Card('S', 'J'),
//     new Card('A', 'S'),
//     new Card('K', 'S'),
//     new Card('Q', 'S')
// ]
// const hand4 = [
//     new Card('B', 'J'),
//     new Card('2', 'S'),
//     new Card('A', 'S'),
//     new Card('K', 'S'),
//     new Card('Q', 'S')
// ]
// const hand5 = [
//     new Card('B', 'J'),
//     new Card('2', 'S'),
//     new Card('A', 'S'),
//     new Card('Q', 'S')
// ]
// let trick = new Trick([], [], '', '2', 'S');
// console.log('test1', trick.countTractors(trick.getTractors(hand1, '2', 'S')));
// console.log('test2', trick.countTractors(trick.getTractors(hand2, '2', 'S')));
// console.log('test3', trick.countTractors(trick.getTractors(hand3, '2', 'S')));
// // console.log('test3.1', Math.min(trick.countTractors(trick.getTractors(hand3, '2', 'S'))));
// console.log('test4', trick.countTractors(trick.getTractors(hand4, '2', 'S')));
// console.log('test5', trick.countTractors(trick.getTractors(hand5, '2', 'S')));


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

io.on('connection', (socket) => {
    su.addSocket(socket);
    su.removeSocket(socket)
    if (constants.interval) {
        clearInterval(constants.interval);
    }
})

server.listen(port, () => {
    console.log(`Listening on port: ${port}`);
});

exports.io = io