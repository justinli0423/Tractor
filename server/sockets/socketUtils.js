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
            constants.game.new_round()
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

    emitBottom(socketId, bottom) {
        console.log('Sending', this._sockets[socketId], 'the bottom:', bottom);
        this.getSocket(socketId).emit('originalBottom', bottom)
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
        // subSetBid(socketId, bidRound) {
        this.getSocket(socketId).on('newBid', (bid) => {
            console.log("Received bid of", bid, "from", this._sockets[socketId]);
            // cb(bid, socketId);
            constants.game.round.bidRound.receiveBid(bid, socketId);
            this.emitNewBid(socketId, bid);
        })
    }

    subDoneBid(socketId) {
        // subDoneBid(socketId, bidRound) {
        this.getSocket(socketId).on('doneBid', () => {
            console.log(`${this._sockets[socketId]} is done bidding.`);
            this.closeBidSubs(socketId)
            constants.game.round.bidRound.doneBid();
        })
    }

    // subNewBottom(socketId, bidRound) {
    subNewBottom(socketId) {
        console.log('Waiting for bottom from', socketId)
        // console.log(bidRound);
        this.getSocket(socketId).on('newBottom', (bottom) => {
            this.closeBottomSub(socketId);
            constants.game.round.bidRound.bottom = bottom;
            constants.game.round.play();
        })
    }

    // ------------ SOCKET CLOSERS ------------

    closeBidSubs(socketId) {
        this.getSocket(socketId).removeAllListeners('newBid');
        this.getSocket(socketId).removeAllListeners('doneBid');
    }

    closeBottomSub(socketId) {
        this.getSocket(socketId).removeAllListeners('newBottom');
    }

}

module.exports = SocketUtil;