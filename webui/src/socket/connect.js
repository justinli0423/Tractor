import io from "socket.io-client";

const ENDPOINT = "http://127.0.0.1:8000";
var socket = null;

export function connectToSocket() {
  socket = io(ENDPOINT);
  return socket;
}

export function setSocketID(id) {
  return socket.emit('setSocketID', id);
}

