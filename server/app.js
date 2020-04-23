const express = require('express');
const socketIo = require('socket.io');
const http = require('http');

const index = require('./routes/index');
const port = process.env.PORT || 8000;
const app = express();

app.use(index);
const server = http.createServer(app);
const io = socketIo(server);
const sockets = {};


let interval;

const getSocketID = socket => {
    socket.on('setSocketID', (username) => {
        socket.username = username;
        console.log(socket.username);
        return socket;
    });
}

const getConnectionStatus = socket => {
    socket.emit('connectionStatus', socket.connected);
}

io.on('connection', (socket) => {
    console.log('newClient');

    getConnectionStatus(socket);

    socket.on('disconnect', () => {
        console.log(`socket ${socket.username} disconnected`);
        clearInterval(interval);
    })
})

server.listen(port, () => {
    console.log(`Listening on port: ${port}`);
})

