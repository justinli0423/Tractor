const _ = require('underscore');
const Game = require('../game/game');

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

    getSocket(socketID) {
        return io.to(socketID);
    }

    start() {
        console.log('start:', Object.keys(this._sockets).length)
        // TODO: CHANGE SOCKET LENGTH BACK TO 4
        if (Object.keys(this._sockets).length === 2) {
            const game = new Game(Object.keys(this._sockets));
            game.new_round()
        }
    }

    // ------------ SOCKET EMITTERS ------------
    emitConnectedClients() {
        this.clearNullSockets();
        console.log('Total clients:', Object.values(this._sockets));
        io.emit('newClientConnection', this._sockets);
    }

    emitDealCard(socketID, card) {
        io.to(socketID).emit('dealCard', card)
    }

    emitConnectionStatus(socketID, socketStatus = false) {
        io.to(socketID).emit('connectionStatus', socketStatus);
    }

    emitTrumpValue(trumpValue) {
        console.log(`A new round has started. ${trumpValue}'s are trump.`)
        io.emit('trumpValue', trumpValue)
    }

    emitNewBid(socketID, suit) {
        console.log(`${this._sockets[socketID]} has made a bid of ${suit}.`);
        io.to(socketID).broadcast.emit('setNewBid', socketID, suit);
    }



    // ------------ SOCKET SUBS ------------

    subSetBid(socketID) {
        console.log('socketUtils', typeof this)
        io.to(socketID).on('newBid', (id, suit) => {
            this.emitNewBid(socketID, suit);
        })
    }

    addSocket(socket) {
        // once clientId is received:
        // 1. send back connection status
        // 2. send all connect clients
        socket.on('setSocketID', (clientID) => {
            console.log(`Client ${clientID} has connected`);
            this._sockets[socket.id] = clientID;
            this.emitConnectionStatus(socket.id, socket.connected);
            console.log(socket.connected, 'emit connected')
            this.emitConnectedClients();
            this.start();
        });
    }

    removeSocket(socket) {
        socket.on('disconnect', () => {
            clearInterval(global.interval);
            console.log(`Client ${this._sockets[socket.id]} has disconnected`);
            this._sockets[socket.id] = null;
            this.emitConnectedClients();
        });
    }
}

module.exports = SocketUtil;