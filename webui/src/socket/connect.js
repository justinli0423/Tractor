import io from "socket.io-client";
const ENDPOINT = "http://127.0.0.1:8000";

var socket = null;

export function connectToSocketIO(getStatusCb, validator, name, room) {
  // socket = io(ENDPOINT);
  // if (!socket.connected) {
    socket = io('tractorserver.herokuapp.com');
  // }
  getConnectionStatus(getStatusCb, name, room);
  setSocketIdIO(name, room, validator);
}

// ------------------ EVENT EMITTERS ------------------
export function makePlayIO(trick, cardsInHand, validator) {
  socket.emit('clientPlay', trick, cardsInHand, validator); 
}

export function startNewRoundIO() {
  console.log('STARTING NEW ROUND');
  socket.emit('startNewRound');
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

function setSocketIdIO(name, room, validator) {
  socket.emit('setSocketId', name, room, validator);
}

// ------------------ EVENT LISTENERS ------------------
export function getNewRoundIO(getNewRoundCb) {
  socket.on('newRound', getNewRoundCb);
}

export function getPointsIO(getPointsCb) {
  socket.on('opponentPoints', (pointsFromNonBottom) => getPointsCb(pointsFromNonBottom));
}

export function getGeneratedTrumpIO(getGeneratedTrumpCb) {
  socket.on('generateTrump', (clientId, card) => getGeneratedTrumpCb(clientId, card));
}

export function getCurrentWinnerIO(getCurrentWinnerCb) {
  socket.on('currentWinner', (clientId) => {
    getCurrentWinnerCb(clientId);
    console.log(clientId);
  });
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

export function getHiddenBottomIO(setBottomCardsCb) {
  socket.on('hiddenBottom', (cards) => setBottomCardsCb(cards));
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

function getConnectionStatus(setStatusCb, name, room) {
  socket.on('connectionStatus', status => {
    console.log('connected');
    setStatusCb(status, socket.id, name, room);
  });
}
