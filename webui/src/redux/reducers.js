const currState = {
  clients: {},
  socket: { connected: false },
  name: '',
  trump: ['2', 'H'],
  currentBottomClient: null,
  cardCallForBottom: null,
  numStateUpdated: 0


}

export default (state = currState, action) => {
  switch (action.type) {
    case 'SET_NEW_CLIENT':
      return Object.assign({}, state, {
        clients: action.payload,
        numStateUpdated: state.numStateUpdated + 1
      })
    default: 
      return state;      
  }
}