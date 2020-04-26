export const updateClientList = (clients) => ({
  type: 'UPDATE_CLIENT_LIST',
  payload: {
    clients,
    clientIds: Object.keys(clients)
  }
});

export const setName = (name) => ({
  type: 'SET_NAME',
  payload: name
});

export const setBottomClient = (name) => ({
  type: 'SET_BOTTOM',
  payload: name
})

export const updateCardsInHand = (cards) => ({
  type: 'UPDATE_MY_HAND',
  payload: cards
})