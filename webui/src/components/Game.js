import React, { Component } from "react";
import { connect } from 'react-redux';
import styled from 'styled-components';

import PlayingCards from '../utils/Cards';
import {
  getCardsIO,
  getNewBidIO,
  getTrumpValueIO,
  getPointsIO,
  getNewRoundIO,
  getCurrentWinnerIO,
  getFinalBidIO,
  getBottomIO
} from "../socket/connect";

import {
  getId,
  getMyCards,
  updateState,
  getExistingClients,
  getCurrentBid,
  getTrumpValue,
  getTrumpTracker,
  getCanSelectCards,
  getNumCardsSelected,
  getExistingTricks,
  getScreenSize,
  getValidBids
} from '../redux/selectors';

import {
  updateCardsInHand,
  setCurrentBid,
  setClientTurn,
  setTricksPlayed,
  setPoints,
  setTrumpValue,
  updateNumCardsSelected,
  toggleCardSelector,
  toggleBidButtons,
  setCurrentTrickWinner,
  setValidBids
} from '../redux/actions';

const Cards = new PlayingCards('/cardsSVG/');

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cardWidth: 120,
      cardHeight: 168,
      cardSelectedHeight: -30,
      cardHoveredHeight: -50,
      numCardsForBottom: 0
    };
  }
  // all listeners required pre-game goes here
  componentDidMount() {
    this.setStage1Listeners();
    this.setCardSize();
  }

  setStage1Listeners() {
    getTrumpValueIO(this.props.setTrumpValue.bind(this));
    getCardsIO(this.setCards.bind(this));
    getNewBidIO(this.updateBidStatus.bind(this));
    getBottomIO(this.receiveBottomCards.bind(this));
    getFinalBidIO(this.sortHand.bind(this));
    getPointsIO(this.getPoints.bind(this));
    getCurrentWinnerIO(this.getCurrentWinner.bind(this));
    getNewRoundIO(this.startNewRound.bind(this));
    this.setCardSize();
  }

  startNewRound() {
    const {
      setCurrentBid,
      setClientTurn,
      setTricksPlayed,
      setPoints,
      toggleBidButtons,
      setValidBids,
      setCurrentTrickWinner,
      updateCardsInHand
    } = this.props;

    setCurrentBid('', null);
    updateCardsInHand([], { 'S': 0, 'D': 0, 'C': 0, 'H': 0, 'SJ': 0, 'BJ': 0 });
    setValidBids([]);
    setClientTurn(null);
    setTricksPlayed({});
    setCurrentTrickWinner(null);
    setPoints(0);
    toggleBidButtons(true);
    console.log('resetting round');
  }

  getCurrentWinner(clientId) {
    console.log('current trick winner', clientId);
    this.props.setCurrentTrickWinner(clientId);
  }

  sortHand() {
    const {
      cards,
      currentBid,
      trumpTracker,
      trumpValue
    } = this.props;
    this.props.updateCardsInHand(Cards.sortHand(cards, trumpValue, currentBid[1]), trumpTracker);
  }

  getPoints(points) {
    this.props.setPoints(points);
  }

  setCardSize() {
    const {
      appWidth
    } = this.props;
    let cardWidth, cardHeight, cardHoveredHeight, cardSelectedHeight;

    if (appWidth === 2560) {
      cardWidth = 204;
      cardHeight = 286;
      cardSelectedHeight = -70;
      cardHoveredHeight = -90;
    }
    if (appWidth === 1920) {
      cardWidth = 120;
      cardHeight = 168;
      cardSelectedHeight = -30;
      cardHoveredHeight = -50;
    }
    if (appWidth === 1280) {
      cardWidth = 110;
      cardHeight = 148;
      cardSelectedHeight = -30;
      cardHoveredHeight = -50;
    }

    this.setState({
      cardWidth,
      cardHeight,
      cardHoveredHeight,
      cardSelectedHeight
    });
  }

  setCards(newCard) {
    let {
      cards,
      trumpValue,
      trumpTracker,
      validBids,
      currentBid,
    } = this.props;
    console.log('newCard', newCard);
    Cards.insertCard(cards, newCard, trumpValue, currentBid);
    Cards.newTrump(trumpTracker, validBids, newCard, currentBid, trumpValue);
    setValidBids(validBids);
    updateCardsInHand(cards, trumpTracker);
  }

  receiveBottomCards(bottomCards) {
    bottomCards.forEach(bottomCard => {
      this.setCards(bottomCard);
    });
    this.props.toggleCardSelector(true);
    this.props.toggleBidButtons(false);
  }

  toggleSingleCard(cardIndex) {
    const {
      cards,
      numCardsSelected
    } = this.props;
    let isSelected = cards[cardIndex].isSelected;

    if (!isSelected) {
      this.props.updateNumCardsSelected(numCardsSelected + 1);
    } else {
      this.props.updateNumCardsSelected(numCardsSelected - 1);
    }
    cards[cardIndex].isSelected = !isSelected;
  }

  toggleCards(cardIndex) {
    const {
      cards,
      trumpTracker,
      canSelectCards,
      numCardsSelected
    } = this.props;
    let isSelected = cards[cardIndex].isSelected;
    console.log('canToggleCards', canSelectCards);

    if (!canSelectCards) {
      return;
    }

    // numBottom
    if (cards.length > 25 && !isSelected && numCardsSelected === 8) {
      window.alert('Maximum cards for bottom selected');
      return;
    }

    this.toggleSingleCard(cardIndex);
    this.props.updateCardsInHand(cards, trumpTracker);
  }

  getExistingTrickSvg() {
    const {
      myId,
      existingTricks
    } = this.props;
    if (!existingTricks || !existingTricks[myId]) {
      return [];
    }
    
    return existingTricks[myId].map((card) => Cards.getSvg(card));
  }

  updateBidStatus(socketId, bid) {
    const {
      trumpTracker,
      validBids,
    } = this.props;
    Cards.receiveBid(bid, trumpTracker, validBids);
    this.props.setCurrentBid(socketId, bid);
  }

  render() {
    const {
      cards,
      numCards,
    } = this.props;
    const {
      cardWidth,
      cardHeight,
      cardSelectedHeight,
      cardHoveredHeight
    } = this.state;
    return (
      <Container
        height={cardHeight}
      >
        <CardContainer>
          {this.getExistingTrickSvg().map((card, i) => {
              return (
                <MyCardImgContainer
                  zIndex={i}
                >
                  <MyCardImg
                    draggable={false}
                    width={cardWidth}
                    height={cardHeight}
                    src={card}
                    key={i}
                  />
                </MyCardImgContainer>
              )
            })
          }
        </CardContainer>
        <CardContainer>
          {cards.map((card, i) => {
            return (
              <CardImgContainer
                height={cardHeight}
                onClick={() => { this.toggleCards(i) }}
                numCards={numCards}
                cardWidth={cardWidth}
                cardHoveredHeight={cardHoveredHeight}
                zIndex={i}
              >
                <CardImg
                  // TODO: enable drag and drop custom sorting later?
                  draggable={false}
                  width={cardWidth}
                  height={cardHeight}
                  isSelected={card.isSelected}
                  cardSelectedHeight={cardSelectedHeight}
                  src={card.svg}
                  key={i}
                />
              </CardImgContainer>
              // change the key prop to the name of card
            )
          })}
        </CardContainer>
      </Container>
    )
  }
}

const mapStateToProps = (state) => {
  const myId = getId(state);
  const cards = getMyCards(state);
  const connectedClients = getExistingClients(state);
  const existingTricks = getExistingTricks(state);
  const currentBid = getCurrentBid(state);
  const trumpValue = getTrumpValue(state);
  const trumpTracker = getTrumpTracker(state);
  const validBids = getValidBids(state);
  const canSelectCards = getCanSelectCards(state);
  const numCardsSelected = getNumCardsSelected(state);
  const { appWidth, appHeight } = getScreenSize(state);
  const numCards = cards.length;

  const changeState = updateState(state);
  return {
    myId,
    cards,
    numCards,
    connectedClients,
    existingTricks,
    appWidth,
    appHeight,
    canSelectCards,
    numCardsSelected,
    currentBid,
    trumpValue,
    trumpTracker,
    validBids,
    changeState,
  }
}

const Container = styled.div`
  position: fixed;
  display: flex;
  bottom: 40px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  /* width: 1800px; */
  /* height: ${prop => `${prop.height * 1.8}px`}; */
`;

const CardImg = styled.img`
  flex-shrink: 0;
  width: ${prop => `${prop.width}px`};
  height: ${prop => `${prop.height}px`};
  transform: ${prop => prop.isSelected && `translateY(${prop.cardSelectedHeight}px);`};
`;

const CardContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const MyCardImgContainer = styled.span`
  z-index: ${prop => prop.zIndex};
  display: flex;
  align-items: flex-end;
  
  &:not(:first-child) {
    margin-left: -30px;
  }
`;

const MyCardImg = styled.img`
  flex-shrink: 0;
  width: 50px;
  height: 75px;
`;

const CardImgContainer = styled.span`
  z-index: ${prop => prop.zIndex};
  display: flex;
  align-items: flex-end;
  height: ${prop => `${prop.height + Math.abs(prop.cardHoveredHeight)}px`};

  &:not(:first-child) {
    /* margin-left: ${prop => `-${prop.numCards * 2.3}px`}; */
    margin-left: ${prop => `-${prop.cardWidth * 0.7}px`};
  }

  &:hover ${CardImg} {
    z-index: 100;
    transform: ${prop => `translateY(${prop.cardHoveredHeight}px);`}
  }
`;

export default connect(mapStateToProps, {
  updateCardsInHand,
  setValidBids,
  setCurrentTrickWinner,
  setTrumpValue,
  updateNumCardsSelected,
  toggleCardSelector,
  setPoints,
  toggleBidButtons,
  setClientTurn,
  setTricksPlayed,
  setCurrentBid
})(Game);

