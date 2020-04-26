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
  type: 'SET_BOTTOM',
  payload: socketId
})

export const updateCardsInHand = (cards) => ({
  type: 'UPDATE_MY_HAND',
  payload: cards
})