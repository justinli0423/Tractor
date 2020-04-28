export const updateClientList = (clients) => ({
  type: 'UPDATE_CLIENT_LIST',
  payload: {
    clients,
    clientIds: Object.keys(clients)
  }
});

export const setUser = (name, id) => ({
  type: 'SET_USER',
  payload: {
    name,
    id
  }
});

export const setBottomClient = (socketId) => ({
  type: 'SET_DECLARER',
  payload: socketId
})

export const updateCardsInHand = (cards, trumpTracker) => ({
  type: 'UPDATE_MY_HAND',
  payload: {
    trumpTracker,
    cards
  }
})

export const setValidBids = (validBids) => ({
  type: 'SET_VALID_BIDS',
  payload: validBids
})

export const setCurrentBid = (socketId, bid) => ({
  type: 'SET_CURRENT_BID',
  payload: {
    socketId,
    bid
  }
})