const express = require('express');
const socketIo = require('socket.io');
const http = require('http');

const index = require('./routes/index');
const port = process.env.PORT || 8000;
const app = express();

app.use(index);
const server = http.createServer(app);
const io = socketIo(server);

let interval;

const getApiAndEmit = socket => {
    const response = new Date();
    socket.emit('FromApi', response);
}

io.on('connection', (socket) => {
    console.log('newClient');
    if (interval) {
        clearInterval(interval);
    }
    interval = setInterval(() => {
        return getApiAndEmit(socket);
    }, 1000);
    socket.on('disconnect', () => {
        console.log('client disconnected');
        clearInterval(interval);
    })
})

server.listen(port, () => {
    console.log(`Listening on port: ${port}`);
})