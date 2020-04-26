import io from "socket.io-client";
const ENDPOINT = "http://127.0.0.1:8000";

var socket = null;

export function connectToSocketIO(getStatusCb, id) {
  socket = io(ENDPOINT);
  getConnectionStatus(getStatusCb);
  setSocketID(id);
}

export function getConnectedClientsIO(setClientsCb) {
  socket.on('newClientConnection', setClientsCb);
}

export function getCardsIO(setCardsCb) {
  socket.on('dealCard', setCardsCb);
}

export function callBottomIO(id) {
  socket.emit('callBottom', id);
}

export function getCurrentBottomIO(setNewBottomCb) {
  socket.on('setNewBottom', id => setNewBottomCb(id));
}

function setSocketID(id) {
  socket.emit('setSocketID', id);
}

function getConnectionStatus(setStatusCb) {
  socket.on('connectionStatus', status => setStatusCb(status));
}
