import io from "socket.io-client";
const ENDPOINT = "http://127.0.0.1:8000";

var socket = null;

export function connectToSocketIO(getStatusCb, name) {
  socket = io(ENDPOINT);
  getConnectionStatus(getStatusCb, name);
  setSocketID(name);
}

export function getConnectedClientsIO(setClientsCb) {
  socket.on('newClientConnection', setClientsCb);
}

export function getCardsIO(setCardsCb) {
  socket.on('dealCard', setCardsCb);
}

export function makeBidIO(bid) {
  socket.emit('newBid', bid);
}

export function getNewBidIO(setNewBidCb) {
  socket.on('setNewBid', (socketId, bid) => setNewBidCb(socketId, bid));
}

export function getTrumpValueIO(setTrumpValueCb) {
  socket.on('setTrumpValue', trump => setTrumpValueCb(trump));
}

function setSocketID(id) {
  socket.emit('setSocketId', id);
}

function getConnectionStatus(setStatusCb, name) {
  socket.on('connectionStatus', status => setStatusCb(status, socket.id, name));
}
