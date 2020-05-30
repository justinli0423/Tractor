const _ = require('underscore');
const Game = require('../game/game');
const app = require('../app');
const constants = require('../constants');

class SocketUtil {
    constructor(io) {
        this._sockets = {};
        this._rooms = {};
        this._started = {};
    }

    // ------------ HELPERS ------------

    get rooms() {
        return this._rooms
    }

    clearNullSockets() {
        _.each(_.keys(this._sockets), (room) => {
            this._sockets[room] = _.omit(this._sockets[room], (value) => {
                return !value;
            });
        })
    }

    get sockets() {
        return this._sockets
    }

    getSocket(socketId) {
        return constants.io.sockets.sockets[socketId];
    }

    start() {
        _.each(_.keys(this._sockets), (room) => {
            if (Object.keys(this._sockets[room]).length === constants.numPlayers && !this._started[room]) {
                this._started[room] = true;
                constants.io.in(room).emit('newRound');
                constants.games[room] = new Game(room, Object.keys(this._sockets[room]));
                constants.games[room].newRound();
            }
        })
    }

    // ------------ SOCKET EMITTERS ------------
    emitConnectedClients(room) {
        this.clearNullSockets();
        console.log(`Clients in room ${room}:`, Object.values(this._sockets[room]));
        constants.io.in(room).emit('newClientConnection', this._sockets[room]);
    }

    emitDealCard(socketId, card) {
        this.getSocket(socketId).emit('dealCard', card);
    }

    emitConnectionStatus(socketId, socketStatus = false) {
        this.getSocket(socketId).emit('connectionStatus', socketStatus);
    }

    emitTrumpValue(room, trumpValue) {
        console.log(`A new round has started. ${trumpValue}'s are trump.`)
        constants.io.in(room).emit('setTrumpValue', trumpValue)
    }

    emitNewBid(socketId, bid) {
        console.log('Sending', this._sockets[this._rooms[socketId]][socketId], "'s bid of ", bid);
        constants.io.in(this._rooms[socketId]).emit('setNewBid', socketId, bid);
    }

    emitGeneratedTrump(room, name, trump) {
        console.log('Emitted random trump to', name, trump);
        constants.io.in(room).emit('generateTrump', name, trump);
    }

    emitBottom(socketId, bottom) {
        console.log('Sending', this._sockets[this._rooms[socketId]][socketId], 'the bottom:', bottom);
        this.getSocket(socketId).emit('originalBottom', bottom);
    }

    emitNextClient(socketId, i) {
        console.log("It's", this._sockets[this._rooms[socketId]][socketId], "'s turn.");
        constants.io.in(this._rooms[socketId]).emit('nextClient', socketId);
        this.subClientPlay(socketId, i);
    }

    emitCardsPlayed(room, cards) {
        constants.io.in(room).emit('cardsPlayed', cards);
    }

    emitCurrentWinner(socketId) {
        constants.io.in(this._rooms[socketId]).emit('currentWinner', socketId)
        console.log(this._sockets[this._rooms[socketId]][socketId], 'is now winning the trick.')
    }

    emitOpponentPoints(room, points) {
        constants.io.in(room).emit('opponentPoints', points);
    }

    emitEndBottom(room, bottom) {
        console.log('Showing everyone the bottom:', bottom);
        constants.io.in(room).emit('hiddenBottom', bottom);
        constants.io.in(room).emit('nextClient', null);
        _.forEach(Object.keys(this._sockets[room]), (socketId) => {
            this.subStartRound(socketId);
        })
        setTimeout(() => {
            constants.io.in(room).emit('newRound');
        }, 5000);
    }

    // ------------ SOCKET SUBS ------------

    addSocket(socket) {
        // once clientId is received:
        // 1. send back connection status
        // 2. send all connect clients
        socket.on('setSocketId', (name, room, cb) => {
            // this._sockets[this._rooms[socketId]][socket.id] = name;
            if (!this._sockets[room]) {
                this._sockets[room] = {};
                // console.log(this._sockets[room])
            } 
            if (Object.keys(this._sockets[room]).length < constants.numPlayers) {
                this._sockets[room][socket.id] = name;
                this._rooms[socket.id] = room;
                socket.join(room);
                cb(true);
            } else {
                socket.disconnect();
                cb(false);
            }
            this.emitConnectionStatus(socket.id, socket.connected);
            this.emitConnectedClients(room);
            this.start();
        });
    }

    removeSocket(socket) {
        socket.on('disconnect', () => {
            let room = this._rooms[socket.id];
            if (this._sockets[room]) {
                console.log(`Client ${this._sockets[room][socket.id]} has disconnected`);
                delete this._sockets[room][socket.id];
                socket.leave(room);
                console.log(Object.keys(this._sockets[room]).length)
                console.log(this._sockets[room])
                if (Object.keys(this._sockets[room]).length === 0) {
                    delete this._sockets[room];
                    delete this._started[room];
                } else {
                    this.emitConnectedClients(room);
                }
                delete this._rooms[socket.id];
            }
        });
    }

    subSetBid(socketId) {
        console.log('waiting for bids')
        this.getSocket(socketId).on('newBid', (bid) => {
            console.log("Received bid of", bid, "from", this._sockets[this._rooms[socketId]][socketId]);
            // cb(bid, socketId);
            constants.games[this._rooms[socketId]].round.bidRound.receiveBid(bid, socketId);
            this.emitNewBid(socketId, bid);
        })
    }

    subDoneBid(socketId) {
        this.getSocket(socketId).on('doneBid', () => {
            console.log(`${this._sockets[this._rooms[socketId]][socketId]} is done bidding.`);
            this.closeBidSubs(socketId)
            constants.games[this._rooms[socketId]].round.bidRound.doneBid();
        })
    }

    subNewBottom(socketId) {
        this.getSocket(socketId).on('newBottom', (bottom) => {
            console.log('New bottom sent by ', this._sockets[this._rooms[socketId]][socketId], ':', bottom);
            constants.io.emit('bidWon');
            this.closeBottomSub(socketId);
            constants.games[this._rooms[socketId]].round.bidRound.bottom = bottom;
            constants.games[this._rooms[socketId]].round.play();
        })
    }

    subClientPlay(socketId, i) {
        console.log('Waiting for play from', this._sockets[this._rooms[socketId]][socketId]);
        this.getSocket(socketId).on('clientPlay', (play, other, callback) => {
            const Trick = constants.games[this._rooms[socketId]].round.playRound.trick;
            console.log('New play sent by ', this._sockets[this._rooms[socketId]][socketId], ':', play);
            const valid = Trick.isValid.call(Trick, socketId, play, other, i);
            console.log()
            callback(valid[1], valid[2]);
            if (valid[0]) {
                this.closeClientPlaySub(socketId);
                this.emitCardsPlayed(Trick.room, Trick.cardsPlayed());
                if (i === constants.numPlayers - 1) {
                    constants.games[this._rooms[socketId]].round.playRound.nextTrick();
                } else {
                    Trick.play(i + 1);
                }
            }
        })
    }

    subStartRound(socketId) {
        console.log('Waiting to start next round.');
        this.getSocket(socketId).on('startNewRound', () => {
            console.log('Round started by', this._sockets[this._rooms[socketId]][socketId])
            this.closeStartRoundSub(socketId);
            constants.games[this._rooms[socketId]].newRound();
        })
    }

    // ------------ SOCKET CLOSERS ------------

    closeBidSubs(socketId) {
        // console.log(this.getSocket(socketId).eventNames())
        this.getSocket(socketId).removeAllListeners('newBid');
        this.getSocket(socketId).removeAllListeners('doneBid');
    }

    closeBottomSub(socketId) {
        // console.log(this.getSocket(socketId).eventNames())
        this.getSocket(socketId).removeAllListeners('newBottom');
    }

    closeClientPlaySub(socketId) {
        // console.log(this.getSocket(socketId).eventNames())
        this.getSocket(socketId).removeAllListeners('clientPlay');
    }

    closeStartRoundSub(socketId) {
        _.forEach(this._sockets[this._rooms[socketId]], (socket) => {
            this.getSocket(socketId).removeAllListeners('clientPlay');
        })
    }
}

module.exports = SocketUtil;