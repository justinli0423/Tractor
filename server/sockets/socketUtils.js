const _ = require('underscore');
const Game = require('../game/game');
const app = require('../app');
const constants = require('../constants');

class SocketUtil {
    constructor(io) {
        this._sockets = {};
    }

    // ------------ HELPERS ------------

    get sockets() {
        return this._sockets;
    }

    clearNullSockets() {
        this._sockets = _.omit(this._sockets, (value) => {
            return value === null;
        });
    }

    getNumClients() {
        return Object.keys(this._sockets).length;
    }

    getSocket(socketId) {
        return constants.io.sockets.sockets[socketId];
    }

    start() {
        // TODO: CHANGE SOCKET LENGTH BACK TO 4
        if (Object.keys(this._sockets).length === constants.numPlayers) {
            constants.game = new Game(Object.keys(this._sockets));
            constants.game.newRound();
        }
    }

    // ------------ SOCKET EMITTERS ------------
    emitConnectedClients() {
        this.clearNullSockets();
        console.log('Total clients:', Object.values(this._sockets));
        constants.io.emit('newClientConnection', this._sockets);
    }

    emitDealCard(socketId, card) {
        this.getSocket(socketId).emit('dealCard', card)
    }

    emitConnectionStatus(socketId, socketStatus = false) {
        this.getSocket(socketId).emit('connectionStatus', socketStatus);
    }

    emitTrumpValue(trumpValue) {
        console.log(`A new round has started. ${trumpValue}'s are trump.`)
        constants.io.emit('setTrumpValue', trumpValue)
    }

    emitNewBid(socketId, bid) {
        console.log('Sending', this._sockets[socketId], "'s bid of ", bid);
        this.getSocket(socketId).broadcast.emit('setNewBid', socketId, bid);
    }

    emitGeneratedTrump(clientId, trump) {
        console.log('Emitted random trump to', clientId, trump);
        constants.io.emit('generateTrump', clientId, trump);
    }

    emitBottom(socketId, bottom) {
        console.log('Sending', this._sockets[socketId], 'the bottom:', bottom);
        this.getSocket(socketId).emit('originalBottom', bottom);
    }

    emitNextClient(socketId, i) {
        console.log(`It's ${this._sockets[socketId]}'s turn.`);
        constants.io.emit('nextClient', socketId);
        this.subClientPlay(socketId, i);
    }

    emitCardsPlayed(cards) {
        constants.io.emit('cardsPlayed', cards);
    }

    emitOpponentPoints(points) {
        constants.io.emit('opponentPoints', points);
    }

    // ------------ SOCKET SUBS ------------

    addSocket(socket) {
        // once clientId is received:
        // 1. send back connection status
        // 2. send all connect clients
        socket.on('setSocketId', (clientID) => {
            this._sockets[socket.id] = clientID;
            this.emitConnectionStatus(socket.id, socket.connected);
            this.emitConnectedClients();
            this.start();
        });
    }

    removeSocket(socket) {
        socket.on('disconnect', () => {
            clearInterval(constants.interval);
            console.log(`Client ${this._sockets[socket.id]} has disconnected`);
            this._sockets[socket.id] = null;
            this.emitConnectedClients();
        });
    }

    subSetBid(socketId) {
        console.log('waiting for bids')
        this.getSocket(socketId).on('newBid', (bid) => {
            console.log("Received bid of", bid, "from", this._sockets[socketId]);
            // cb(bid, socketId);
            constants.game.round.bidRound.receiveBid(bid, socketId);
            this.emitNewBid(socketId, bid);
        })
    }

    subDoneBid(socketId) {
        this.getSocket(socketId).on('doneBid', () => {
            console.log(`${this._sockets[socketId]} is done bidding.`);
            this.closeBidSubs(socketId)
            constants.game.round.bidRound.doneBid();
        })
    }

    subNewBottom(socketId) {
        this.getSocket(socketId).on('newBottom', (bottom) => {
            console.log('New bottom sent by ', this._sockets[socketId], ':', bottom);
            constants.io.emit('bidWon');
            this.closeBottomSub(socketId);
            constants.game.round.bidRound.bottom = bottom;
            constants.game.round.play();
        })
    }

    subClientPlay(socketId, i) {
        console.log('Waiting for play from', this._sockets[socketId]);
        this.getSocket(socketId).on('clientPlay', (play, other, callback) => {
            const Trick = constants.game.round.playRound.trick;
            console.log('New play sent by ', this._sockets[socketId], ':', play);
            const valid = Trick.isValid.call(Trick, socketId, play, other, i);
            console.log()
            callback(valid[1], valid[2]);
            if (valid[0]) {
                this.closeClientPlaySub(socketId);
                this.emitCardsPlayed(Trick.cardsPlayed());
                if (i === constants.numPlayers - 1) {
                    constants.game.round.playRound.nextTrick();
                } else {
                    Trick.play(i + 1);
                }
            }
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

}

module.exports = SocketUtil;