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
  setDoneBidIO
} from '../socket/connect';

import {
  setCurrentBid,
  toggleBidButtons,
  updateCardsInHand,
  toggleBottomSelector,
  updateNumCardsSelected,
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
      id,
      trumpTracker,
      validBids,
    } = props;
    makeBidIO(bid);
    props.setCurrentBid(id, bid);
    Cards.updateBid(bid, trumpTracker, validBids);
  }

  const setDoneBid = () => {
    setDoneBidIO();
    props.toggleBidButtons(false);
  }

  const emitReturnBottom = () => {
    const { cards } = props;
    let bottomCards = [];
    let cardsInHand = [];
    cards.forEach(card => {
      if (card.isSelectedForBottom) {
        bottomCards.push(card.card);
      } else {
        cardsInHand.push(card);
      }
    })

    props.updateCardsInHand(cardsInHand);
    props.toggleBottomSelector(false);
    props.updateNumCardsSelected(0);
    returnBottomIO(bottomCards);
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
      {props.canBidForBottom && <RegularButton
        id="finishBidBtn"
        label="Finish Bid"
        onClickCb={setDoneBid}
      />}
      {props.numCardsSelected === 4 &&
        <RegularButton
          id="finishBottomBtn"
          label="Finish Bottom"
          onClickCb={emitReturnBottom}
        />}
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
  const id = getId(state);
  const validBids = getValidBids(state);
  const trumpValue = getTrumpValue(state);
  const trumpTracker = getTrumpTracker(state);
  const currentBid = getCurrentBid(state);
  const canBidForBottom = getCanBidForBottom(state);
  const cards = getMyCards(state);
  const numCardsSelected = getNumCardsSelected(state);

  const numUpdateStates = updateState(state);
  return {
    id,
    name,
    cards,
    validBids,
    currentBid,
    trumpValue,
    canBidForBottom,
    trumpTracker,
    numCardsSelected,
    numUpdateStates
  };
}

const AllButtonsContainer = styled.div`
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
`;

export default connect(mapStateToProps, {
  setCurrentBid,
  toggleBidButtons,
  updateCardsInHand,
  toggleBottomSelector,
  updateNumCardsSelected
})(CallBottomButtons);