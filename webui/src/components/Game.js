import React, { Component } from "react";
import { connect } from 'react-redux';
import styled from 'styled-components';

import PlayingCards from '../utils/Cards';
import {
  getCardsIO,
  getNewBidIO,
  getTrumpValueIO,
} from "../socket/connect";

import {
  getMyCards,
  updateState,
  getExistingClients,
  getCurrentBid,
  getTrumpValue, 
  getTrumpTracker, 
  getValidBids
} from '../redux/selectors';

import {
  updateCardsInHand,
  setCurrentBid,
  setTrumpValue,
  setValidBids
} from '../redux/actions';

const Cards = new PlayingCards();
const cardWidth = 120;
const cardHeight = 168;

class Game extends Component {
  componentDidMount() {
    getTrumpValueIO(this.props.setTrumpValue.bind(this));
    getCardsIO(this.setCards.bind(this));
    getNewBidIO(this.updateBidStatus.bind(this));
  }

  setCards(newCard) {
    const {
      trumpValue,
      trumpTracker,
      validBids,
      currentBid,
      cards
    } = this.props;
    if (!newCard || newCard.length !== 2) return;
    // TODO: undo hardcoding
    Cards.insertCard(cards, newCard, trumpValue, currentBid);
    Cards.newTrump(trumpTracker, validBids, newCard, currentBid, trumpValue);
    this.props.setValidBids(validBids);
    this.props.updateCardsInHand(cards, trumpTracker);
  }

  updateBidStatus(socketId, bid) {
    const {
      trumpTracker,
      validBids,
    } = this.props;
    Cards.receiveBid(bid, trumpTracker, validBids);
    const bidString = `${bid[0]}${bid[1]}`;
    this.props.setCurrentBid(socketId, bidString);
  }

  render() {
    const {
      cards,
      numCards
    } = this.props;
    return(
      <Container 
        height={cardHeight}
      >
        {/* <img src={cardSvgs[1]} /> */}
        {cards.map((card, i) => {
          return (
            <CardImg
              width={cardWidth}
              height={cardHeight}
              numCards={numCards}
              src={card.svg}
              key={i}
            />
            // change the key prop to the name of card
          )
        })}
      </Container>
    )
  }
}

const mapStateToProps = (state) => {
  const cards = getMyCards(state);
  const connectedClients = getExistingClients(state);
  const currentBid = getCurrentBid(state);
  const trumpValue = getTrumpValue(state);
  const trumpTracker = getTrumpTracker(state);
  const validBids = getValidBids(state);
  const changeState = updateState(state);

  const numCards = cards.length;
  return {
    cards,
    numCards,
    connectedClients,
    currentBid,
    trumpValue,
    trumpTracker,
    validBids,
    changeState,
  }
}

const Container = styled.div`
  position: absolute;
  display: flex;
  bottom: 2em;
  flex-direction: row;
  justify-content: center;
  align-items: flex-end;
  width: 1800px;
  height: ${prop => `${prop.height * 1.6}px`};
  overflow-y: scroll;
  scroll-behavior: smooth;
  ::-webkit-scrollbar {
    width: 0px;
    background: transparent;
}
`;

const CardImg = styled.img`
  width: ${prop => `${prop.width}px`};
  height: ${prop => `${prop.height}px`};
  flex-shrink: 0;
  filter: greyscale(1);

  &:not(:first-child) {
    margin-left: ${prop => `-${prop.numCards * 2.2}px`};
  }

  &:hover {
    z-index: 100;
    transform: scale(1.5) translateY(-28px);
    /* width: ${prop => `${prop.width * 1.5}px`};
    height: ${prop => `${prop.height * 1.5}px`}; */
    /* margin-left: ${prop => `-${prop.numCards}px`}; */
  }
`;

export default connect(mapStateToProps, {
  updateCardsInHand,
  setValidBids,
  setTrumpValue,
  setCurrentBid
})(Game);

