const express = require('express');
const socketIo = require('socket.io');
const http = require('http');
const constants = require('./constants');

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
})

server.listen(port, () => {
    console.log(`Listening on port: ${port}`);
});

exports.io = io