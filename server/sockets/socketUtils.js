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
        return this._sockets
    }

    add_socket(socket) {
        socket.on('setSocketID', (clientID) => {
            this._sockets[socket.id] = clientID;
            console.log('length', Object.keys(this._sockets).length);
            console.log(`Client #${Object.keys(this._sockets).length} (${clientID}) has connected`);
            socket.emit('connectionStatus', socket.connected);
            this.start();
        });
    }

    remove_socket(socket) {
        socket.on('disconnect', () => {
            clearInterval(global.interval);
            console.log(`Client ${this._sockets[socket.id]} has disconnected`);
            this._sockets[socket.id] = null;
        });
    }

    getNumClients() {
        return Object.keys(this._sockets).length
    }

    getSocket(socketID) {
        return this._io.to(socketID)
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