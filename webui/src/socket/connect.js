import io from "socket.io-client";
const ENDPOINT = "http://127.0.0.1:8000";

var socket = null;

export function connectToSocketIO(getStatusCb, id) {
  console.log('connect', 1)
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

// refactored from callBottomIO
export function makeBidIO(id, suit) {
  socket.emit('newBid', id, suit);
}

// refactored from getNewBidIO
export function getNewBidIO(setNewBottomCb) {
  socket.on('setNewBid', id => setNewBottomCb(id));
}

function setSocketID(id) {
  socket.emit('setSocketID', id);
}

function getConnectionStatus(setStatusCb) {
  console.log('connect', 2)
  socket.on('connectionStatus', status => setStatusCb(status));
}
