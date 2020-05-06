import io from "socket.io-client";
const ENDPOINT = "http://127.0.0.1:8000";

var socket = null;

export function connectToSocketIO(getStatusCb, name) {
  socket = io(ENDPOINT);
  if (!socket.connected) {
    socket = io('tractorio.web.app:443');
  }
  getConnectionStatus(getStatusCb, name);
  setSocketIdIO(name);
}

// ------------------ EVENT EMITTERS ------------------
export function makePlayIO(trick, cardsInHand, validator) {
  // console.log('emitting cards', trick);
  socket.emit('clientPlay', trick, cardsInHand, validator);
}

export function makeBidIO(bid) {
  socket.emit('newBid', bid);
}

export function setDoneBidIO() {
  socket.emit('doneBid');
}

// returning the 8 cards you don't want
export function returnBottomIO(bottom) {
  console.log(socket.id, 'returning bottom', bottom);
  socket.emit('newBottom', bottom);
}

function setSocketIdIO(id) {
  socket.emit('setSocketId', id);
}

// ------------------ EVENT LISTENERS ------------------
export function getGeneratedTrumpIO(getGeneratedTrumpCb) {
  socket.on('generateTrump', (clientId, card) => getGeneratedTrumpCb(clientId, card));
}

export function getFinalBidIO (getFinalBidCb) {
  socket.on('bidWon', getFinalBidCb);
}

export function getClientTurnIO(getClientTurnCb) {
  socket.on('nextClient', (clientId) => {
    getClientTurnCb(clientId);
  });
}

export function getTricksPlayedIO(getTricksPlayedCb) {
  socket.on('cardsPlayed', (tricks) => {
    console.log('Received current tricks', tricks);
    getTricksPlayedCb(tricks);
  });
}

export function getBottomIO(setBottomCardsCb) {
  socket.on('originalBottom', (cards) => setBottomCardsCb(cards));
}

export function getConnectedClientsIO(setClientsCb) {
  socket.on('newClientConnection', setClientsCb);
}

export function getCardsIO(setCardsCb) {
  socket.on('dealCard', setCardsCb);
}

export function getNewBidIO(setNewBidCb) {
  socket.on('setNewBid', (socketId, bid) => setNewBidCb(socketId, bid));
}

export function getTrumpValueIO(setTrumpValueCb) {
  socket.on('setTrumpValue', trump => setTrumpValueCb(trump));
}

function getConnectionStatus(setStatusCb, name) {
  socket.on('connectionStatus', status => {
    console.log('connected');
    setStatusCb(status, socket.id, name);
  });
}
