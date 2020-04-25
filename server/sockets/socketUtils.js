const _ = require('underscore');
const Game = require('../game/game');

class SocketUtil {
    constructor(io) {
        this._io = io;
        this._sockets = {};
    }

    // ------------ HELPERS ------------
    get io() {
        return this._io
    }

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
        return this._io.to(socketID);
    }

    start() {
        console.log('start:', Object.keys(this._sockets).length)
        if (Object.keys(this._sockets).length === 1) {
            const game = new Game(this, this._io, Object.keys(this._sockets));
            game.new_round()
        }
    }

    // ------------ SOCKET EMITTERS ------------
    setConnectedClients() {
        this.clearNullSockets();
        console.log('Total clients:', Object.values(this._sockets));
        this._io.emit('newClientConnection', this._sockets);
    }

    dealCards(playerNum, card) {
        this.getSocket(playerNum).emit('dealCard', card)
    }

    // ------------ SOCKET LISTENERS ------------
    setConnectionStatus(socket, socketStatus = false) {
        socket.emit('connectionStatus', socketStatus);
    }

    addSocket(socket) {
        // once clientId is received:
        // 1. send back connection status
        // 2. send all connect clients
        socket.on('setSocketID', (clientID) => {
            console.log(`Client ${clientID} has connected`);
            this._sockets[socket.id] = clientID;
            this.setConnectionStatus(socket, socket.connected);
            this.setConnectedClients();
            this.start();
        });
    }

    removeSocket(socket) {
        socket.on('disconnect', () => {
            clearInterval(global.interval);
            console.log(`Client ${this._sockets[socket.id]} has disconnected`);
            this._sockets[socket.id] = null;
            this.setConnectedClients();
        });
    }
}

module.exports = SocketUtil;