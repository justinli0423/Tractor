const currState = {
  appWidth: 1920,
  appHeight: 1080,
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
  // canSelectCards & numCardsSelected is for 
  // both returning bottom and playing cards on your turn
  canSelectCards: false,
  numCardsSelected: 0,
  // canBidForBottom is only true beginning of each round
  canBidForBottom: true,
  // TODO: add everyone elses play - should be by socketId index
  // [[cards by player0], [cards by player1]]
  cardsPlayed: [],
  numStateUpdated: 0
}

export default (state = currState, action) => {
  switch (action.type) {
    case 'SET_SCREEN_SIZE':
      return Object.assign({}, state, {
        appWidth: action.payload.width,
        appHeight: action.payload.height
      })
    case 'UPDATE_CLIENT_LIST':
      return Object.assign({}, state, {
        clients: action.payload.clients,
        clientIds: action.payload.clientIds,
        numStateUpdated: state.numStateUpdated + 1
      })
    case 'SET_USER':
      return Object.assign({}, state, {
        name: action.payload.name,
        id: action.payload.id
      })
    case 'SET_DECLARER':
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
    case 'SET_TRUMP_VALUE':
      return Object.assign({}, state, {
        trump: action.payload
      })
    case 'SET_CURRENT_BID':
      return Object.assign({}, state, {
        currentBid: action.payload.bid,
        currentBottomClient: action.payload.socketId,
        numStateUpdated: state.numStateUpdated + 1
      })
    case 'CAN_SELECT_CARDS':
      return Object.assign({}, state, {
        canSelectCards: action.payload
      })
    case 'UPDATE_NUM_CARDS_SELECTED':
      return Object.assign({}, state, {
        numCardsSelected: action.payload
      })
    case 'TOGGLE_BID_BUTTONS':
      return Object.assign({}, state, {
        canBidForBottom: action.payload
      })
    default:
      return state;
  }
}