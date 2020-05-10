import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import RegularButton from './RegularButton';
import GameButton from './GameButton';
import Unicodes from '../utils/Unicodes';
import PlayingCards from '../utils/Cards';

import {
  makeBidIO,
  returnBottomIO,
  getClientTurnIO,
  getTricksPlayedIO,
  getGeneratedTrumpIO,
  makePlayIO,
  setDoneBidIO
} from '../socket/connect';

import {
  setClientTurn,
  setTricksPlayed,
  setCurrentBid,
  toggleBidButtons,
  updateCardsInHand,
  toggleCardSelector,
  updateNumCardsSelected,
  setPoints,
} from '../redux/actions';

import {
  getName,
  getId,
  getMyCards,
  getValidBids,
  getCurrentBid,
  getTrumpValue,
  getTrumpTracker,
  getCanBidForBottom,
  getClientTurn,
  getNumCardsSelected,
  updateState
} from '../redux/selectors';

const Cards = new PlayingCards();

const CallBottomButtons = (props) => {
  // TODO: 1. pass correct value
  // TODO: 2. remove invalid bids

  // e.g. if I have 2 (2 of spades) -> [2, 'S'];
  // e.g. no trump: ['S', 'J'] or ['B', 'J']
  const setBottom = (bid) => {
    const {
      myId,
      trumpTracker,
      validBids,
    } = props;
    makeBidIO(bid);
    props.setCurrentBid(myId, bid);
    Cards.updateBid(bid, trumpTracker, validBids);
  }

  const setDoneBid = () => {
    const { cards } = props;
    setDoneBidIO();
    props.toggleBidButtons(false);
    getClientTurnIO(enableTurnsListener);
    getTricksPlayedIO(enableTricksListener);
    getGeneratedTrumpIO(enableTrumpListener);
    // resetting trump tracker after bidding
    updateCardsInHand(cards, { 'S': 0, 'D': 0, 'C': 0, 'H': 0, 'SJ': 0, 'BJ': 0 });
  }

  const enableTrumpListener = (clientId, trumpCard) => {
    props.setCurrentBid(clientId, trumpCard);
  }

  const enableTurnsListener = (clientId) => {
    const {
      myId,
      setClientTurn,
      toggleCardSelector
    } = props;
    setClientTurn(clientId);
    console.log('enableTurnsListener', `${clientId}'s turn`);
    if (myId === clientId) {
      toggleCardSelector(true);
    } else {
      toggleCardSelector(false);
    }
  }

  const enableTricksListener = (tricksPlayed) => {
    props.setTricksPlayed(tricksPlayed);
  }

  const emitReturnBottom = () => {
    const {
      cards,
      trumpTracker,
      updateCardsInHand,
      toggleCardSelector,
      updateNumCardsSelected
    } = props;
    let bottomCards = [];
    let cardsInHand = [];
    cards.forEach(card => {
      if (card.isSelected) {
        bottomCards.push(card.card);
      } else {
        cardsInHand.push(card);
      }
    })

    console.log('cards sent back for bottom', bottomCards);
    updateCardsInHand(cardsInHand, trumpTracker);
    toggleCardSelector(false);
    updateNumCardsSelected(0);
    returnBottomIO(bottomCards);
  }

  const emitTrickValidator = (isValidPlay, cardsInHand) => {
    const {
      cards,
      updateCardsInHand,
      trumpTracker,
      toggleCardSelector,
      trumpValue,
      setClientTurn,
      setCurrentBid,
      currentBid,
      updateNumCardsSelected
    } = props;
    if (isValidPlay === 'valid') {
      updateCardsInHand(cardsInHand, trumpTracker);
      toggleCardSelector(false);
      updateNumCardsSelected(0);
      if (cardsInHand.length === 0) {
        setTimeout(() => {
          setCurrentBid('', []); // clears trump
          updateCardsInHand([], { 'S': 0, 'D': 0, 'C': 0, 'H': 0, 'SJ': 0, 'BJ': 0 });
          setClientTurn(null);
          setPoints(0);
        }, 2000);
      }
    } else if (isValidPlay === 'invalid') {
      alert('Invalid Trick');
      updateCardsInHand(cards.map(cardObj => {
        cardObj.isSelected = false;
        return cardObj;
      }), trumpTracker);
    } else if (isValidPlay === 'badThrow') {
      alert('Bad Throw!');
      console.log(cards)
      Cards.sortHand(cards, trumpValue, currentBid[1], trumpTracker);
      updateCardsInHand(cards.map(cardObj => {
        cardObj.isSelected = false;
        return cardObj;
      }), trumpTracker);
    }
  }

  const emitTrick = () => {
    const { cards } = props;
    let selectedCards = [];
    let cardsInHand = [];
    cards.forEach(card => {
      if (card.isSelected) {
        selectedCards.push(card.card);
      } else {
        cardsInHand.push(card);
      }
    })
    makePlayIO(selectedCards, cardsInHand, emitTrickValidator);
  }

  // returns the array of buttons to be rendered
  const getAvailableBidButtons = () => {
    const { validBids } = props;
    // validBids: [numOfCards, valueOfCards]
    // e.g. if I have 2 (2 of spades) -> [2, 'S'];
    // e.g. no trump: ['S', 'J'] or ['B', 'J']
    let bidArray = [];
    validBids.forEach(bid => {
      let buttonObject = {
        rawData: bid
      };
      if (bid[1] === 'J') { // have 2 jokers to call no trump
        bidArray.push(Object.assign({}, buttonObject, {
          renderData: bid[0] === 'S' ? ['No Trump', 'SJ'] : ['No Trump', 'BJ'],
          color: bid[0] === 'S' ? 'black' : 'red'
        }));
      } else {
        bidArray.push(Object.assign({}, buttonObject, {
          renderData: [bid[0], bid[1]],
          color: (bid[1] === 'S' || bid[1] === 'C') ? 'black' : 'red'
        }));
      }
    })
    return bidArray;
  }


  const renderBidButtons = () => (
    <BidButtonContainer>
      {props.canBidForBottom && getAvailableBidButtons().map((buttonObject, i) => {
        return (
          <GameButton
            bid={buttonObject.rawData}
            label={buttonObject.renderData[0]}
            icon={Unicodes[buttonObject.renderData[1]] || ''}
            color={buttonObject.color}
            onClickCb={setBottom}
            key={i}
          />
        )
      })}
    </BidButtonContainer>
  )

  const renderFinishButtons = () => (
    <span>
      {props.canBidForBottom &&
        <RegularButton
          id="finishBidBtn"
          label="Finish Bid"
          onClickCb={setDoneBid}
        />}
      {/* TODO: set num cards selected to 8 later */}
      {props.numCardsSelected === 8 && props.cards.length > 25 &&
        <RegularButton
          id="finishBottomBtn"
          label="Finish Bottom"
          onClickCb={emitReturnBottom}
        />}
      {props.clientTurnId === props.myId && !!props.numCardsSelected &&
        <RegularButton
          id="finishTrickBtn"
          label="Finish Trick"
          onClickCb={emitTrick}
        />
      }
    </span>
  )

  return (
    <AllButtonsContainer>
      {renderBidButtons()}
      {renderFinishButtons()}
    </AllButtonsContainer>
  );
}

const mapStateToProps = (state) => {
  const name = getName(state);
  const myId = getId(state);
  const validBids = getValidBids(state);
  const trumpValue = getTrumpValue(state);
  const trumpTracker = getTrumpTracker(state);
  const canBidForBottom = getCanBidForBottom(state);
  const currentBid = getCurrentBid(state);
  const clientTurnId = getClientTurn(state);
  const cards = getMyCards(state);
  const numCardsSelected = getNumCardsSelected(state);

  const numUpdateStates = updateState(state);
  return {
    myId,
    name,
    cards,
    validBids,
    clientTurnId,
    currentBid,
    trumpValue,
    canBidForBottom,
    trumpTracker,
    numCardsSelected,
    numUpdateStates
  };
}

const AllButtonsContainer = styled.div`
  z-index: 100;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const BidButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin: 10px;
  height: 40px;
`;

export default connect(mapStateToProps, {
  setCurrentBid,
  toggleBidButtons,
  updateCardsInHand,
  toggleCardSelector,
  setClientTurn,
  setTricksPlayed,
  updateNumCardsSelected
})(CallBottomButtons);