import io from "socket.io-client";
const ENDPOINT = "http://127.0.0.1:8000";

var socket = null;

export function connectToSocketIO(getStatusCb, name) {
  socket = io(ENDPOINT);
  getConnectionStatus(getStatusCb);
  setSocketID(name);
  console.log(socket);
}

export function getConnectedClientsIO(setClientsCb) {
  socket.on('newClientConnection', setClientsCb);
}

export function getCardsIO(setCardsCb) {
  socket.on('dealCard', setCardsCb);
}

export function makeBidIO(suit) {
  socket.emit('newBid', suit);
}

export function getNewBidIO(setNewBidCb) {
  socket.on('setNewBid', id => setNewBidCb(id));
}

function setSocketID(id) {
  socket.emit('setSocketID', id);
}

function getConnectionStatus(setStatusCb) {
  socket.on('connectionStatus', status => setStatusCb(status, socket.id));
}
