const currState = {
  socket: { connected: false },
  clients: {},
  clientIds: [],
  name: '',
  id: '',
  cards: [],
  trump: ['2', 'H'],
  currentBottomClient: null,
  cardCallForBottom: null,
  numStateUpdated: 0

}

export default (state = currState, action) => {
  switch (action.type) {
    case 'UPDATE_CLIENT_LIST':
      return Object.assign({}, state, {
        clients: action.payload.clients,
        clientIds: action.payload.clientIds,
        numStateUpdated: state.numStateUpdated + 1
      })
    case 'SET_USER':
      console.log(action.payload)
      return Object.assign({}, state, {
        name: action.payload.name,
        id: action.payload.id
      })
    case 'SET_BOTTOM':
      console.log(action.payload);
      return Object.assign({}, state, {
        currentBottomClient: state.clients[action.payload]
      })
    case 'UPDATE_MY_HAND':
      return Object.assign({}, state, {
        cards: action.payload,
        numStateUpdated: state.numStateUpdated + 1
      })
    default: 
      return state;
  }
}