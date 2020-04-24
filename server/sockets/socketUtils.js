const _ = require('underscore');
const Game = require('../game/game');

class SocketUtil {
    constructor(io) {
        this._io = io;
        this._sockets = {};
    }

    get io() {
        return this._io
    }

    get sockets() {
        return this._sockets;
    }

    clear_null_sockets() {
        this._sockets = _.omit(this._sockets, (value) => {
            return value === null;
        });
    }

    set_connection_status(socket, socketStatus = false) {
        socket.emit('connectionStatus', socketStatus);
    }

    set_connected_clients() {
        this.clear_null_sockets();
        console.log('Total clients:', Object.values(this._sockets));
        this._io.emit('newClientConnection', this._sockets);
    }

    add_socket(socket) {
        // once clientId is received:
        // 1. send back connection status
        // 2. send all connect clients
        socket.on('setSocketID', (clientID) => {
            console.log(`Client ${clientID} has connected`);
            this._sockets[socket.id] = clientID;
            this.set_connection_status(socket, socket.connected);
            this.set_connected_clients();
            this.start();
        });
    }

    remove_socket(socket) {
        socket.on('disconnect', () => {
            clearInterval(global.interval);
            console.log(`Client ${this._sockets[socket.id]} has disconnected`);
            this._sockets[socket.id] = null;
            this.set_connected_clients();
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
        if (Object.keys(this._sockets).length === 4) {
            const game = new Game(this, this._io, Object.keys(this._sockets));
            game.new_round()
        }
    }

}

module.exports = SocketUtil;