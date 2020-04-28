const currState = {
  socket: { connected: false },
  clients: {},
  clientIds: [],
  name: '',
  id: '',
  cards: [],
  trump: '2',
  currentBid: null,
  currentBottomClient: null,
  trumpTracker: { 'S': 0, 'D': 0, 'C': 0, 'H': 0, 'SJ': 0, 'BJ': 0 },
  validBids: [],
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
    case 'SET_DECLARER':
      console.log(action.payload);
      return Object.assign({}, state, {
        currentBottomClient: state.clients[action.payload]
      })
    case 'UPDATE_MY_HAND':
      return Object.assign({}, state, {
        cards: action.payload.cards,
        trumpTracker: action.payload.trumpTracker,
        numStateUpdated: state.numStateUpdated + 1
      })
    case 'SET_VALID_BIDS':
      return Object.assign({}, state, {
        validBids: action.payload,
        numStateUpdated: state.numStateUpdated + 1
      })
    case 'SET_CURRENT_BID':
      return Object.assign({}, state, {
        currentBid: action.payload.bid,
        currentBottomClient: action.payload.socketId,
        numStateUpdated: state.numStateUpdated + 1
      })
    default:
      return state;
  }
}