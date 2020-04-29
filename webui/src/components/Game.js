import React, { Component } from "react";
import { connect } from 'react-redux';
import styled from 'styled-components';

import PlayingCards from '../utils/Cards';
import {
  getCardsIO,
  getNewBidIO,
  getTrumpValueIO,
  getBottom
} from "../socket/connect";

import {
  getMyCards,
  updateState,
  getExistingClients,
  getCurrentBid,
  getTrumpValue,
  getTrumpTracker,
  getCanSelectCardsForBottom,
  getNumCardsSelectedForBottom,
  getValidBids
} from '../redux/selectors';

import {
  updateCardsInHand,
  setCurrentBid,
  setTrumpValue,
  updateNumCardsForBottom,
  toggleBottomSelector,
  toggleBidButtons,
  setValidBids
} from '../redux/actions';

const Cards = new PlayingCards();
const cardWidth = 120;
const cardHeight = 168;

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      numCardsForBottom: 0
    };
  }
  // all listeners required pre-game goes here
  componentDidMount() {
    getTrumpValueIO(this.props.setTrumpValue.bind(this));
    getCardsIO(this.setCards.bind(this));
    getNewBidIO(this.updateBidStatus.bind(this));
    getBottom(this.receiveBottomCards.bind(this));
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

  receiveBottomCards(bottomCards) {
    bottomCards.forEach(bottomCard => {
      this.setCards(bottomCard);
    });
    this.props.toggleBottomSelector(true);
    this.props.toggleBidButtons(false);
  }

  toggleCardForBottom(cardIndex) {
    const {
      cards,
      trumpTracker,
      canSelectCardsForBottom,
      numCardsSelectedForBottom
    } = this.props;
    const isSelected = cards[cardIndex].isSelectedForBottom;

    if (!canSelectCardsForBottom) {
      return;
    }

    if (!isSelected && numCardsSelectedForBottom === 4) {
      // TODO: DISPLAY NICER DIALOG FOR USER THAT THEY HAVE 8 SELECTED ALREADY
      window.alert('Maximum cards for bottom selected');
      return;
    }

    if (!isSelected) {
      this.props.updateNumCardsForBottom(numCardsSelectedForBottom + 1);
    } else {
      this.props.updateNumCardsForBottom(numCardsSelectedForBottom - 1);
    }

    cards[cardIndex].isSelectedForBottom = !isSelected;
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
    return (
      <Container
        height={cardHeight}
      >
        {cards.map((card, i) => {
          return (
            <>
              <CardImg
                // TODO: enable drag and drop custom sorting later?
                draggable={false}
                onClick={() => { this.toggleCardForBottom(i) }}
                width={cardWidth}
                height={cardHeight}
                numCards={numCards}
                isSelectedForBottom={card.isSelectedForBottom}
                src={card.svg}
                zIndex={i}
                key={i}
              />
            </>
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
  const canSelectCardsForBottom = getCanSelectCardsForBottom(state);
  const numCardsSelectedForBottom = getNumCardsSelectedForBottom(state);

  const numCards = cards.length;
  return {
    cards,
    numCards,
    connectedClients,
    canSelectCardsForBottom,
    numCardsSelectedForBottom,
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
  flex-shrink: 0;
  z-index: ${prop => prop.zIndex};
  width: ${prop => `${prop.width}px`};
  height: ${prop => `${prop.height}px`};
  transform: ${prop => prop.isSelectedForBottom && 'translateY(-30px);'};
  filter: greyscale(1);

  &:not(:first-child) {
    margin-left: ${prop => `-${prop.numCards * 2.2}px`};
  }

  &:hover {
    z-index: 100;
    transform: translateY(-50px);
    /* width: ${prop => `${prop.width * 1.5}px`};
    height: ${prop => `${prop.height * 1.5}px`}; */
    /* margin-left: ${prop => `-${prop.numCards}px`}; */
  }
`;

export default connect(mapStateToProps, {
  updateCardsInHand,
  setValidBids,
  setTrumpValue,
  updateNumCardsForBottom,
  toggleBottomSelector,
  toggleBidButtons,
  setCurrentBid
})(Game);

