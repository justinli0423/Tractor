const socketIo = require('socket.io');
const io = socketIo(server);

export const getSocket = socketID => {
    return io.to(socketID)
}