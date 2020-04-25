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
        // TODO: CHANGE SOCKE LENGTH BACK TO 4 
        if (Object.keys(this._sockets).length === 2) {
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

    setConnectionStatus(socket, socketStatus = false) {
        socket.emit('connectionStatus', socketStatus);
    }

    broadcastNewBottom(socket, id) {
        console.log(`${id} has called bottom`);
        socket.broadcast.emit('setNewBottom', id);
    }

    // ------------ SOCKET LISTENERS ------------

    setBottomListener(socket) {
        socket.on('callBottom', (id) => {
            this.broadcastNewBottom(socket, id);
        })
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

            // TODO: move somewhere where it make sense
            this.setBottomListener(socket);
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