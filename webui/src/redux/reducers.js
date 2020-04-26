const currState = {
  clients: {},
  clientIds: [],
  socket: { connected: false },
  name: '',
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
    case 'SET_NAME':
      return Object.assign({}, state, {
        name: action.payload
      })
    case 'SET_BOTTOM':
      return Object.assign({}, state, {
        currentBottomClient: action.payload
      })
    default: 
      return state;
  }
}