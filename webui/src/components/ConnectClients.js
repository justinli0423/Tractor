import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import RegularButton from './RegularButton';

import {
  returnBottomIO,
  setDoneBidIO
} from '../socket/connect';

import {
  getExistingClients,
  getExistingClientIds,
  getMyCards,
  getName,
  getCurrentBid,
  getBottomClient,
  getCanSelectCardsForBottom,
  updateState
} from '../redux/selectors';

import {
  updateCardsInHand,
  toggleBottomSelector
} from '../redux/actions';


const ConnectedClients = (props) => {
  const {
    clientIds,
    clients,
    currentBid,
    currentBottomClient
  } = props;

  const emitDoneBid = () => {
    const buttonEl = document.querySelector('#finishBidBtn');
    buttonEl.style.display = 'none';
    setDoneBidIO();
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
    returnBottomIO(bottomCards);
  }
  // TODO: ADD STATE FOR NUM CARDS SELECTED FOR BOTTOM FOR BUTTON TOGGLE AFTER 8 CARDS ARE SELECTED
  return (
    <ClientsContainer>
      <ClientsHeader>Connected Users:</ClientsHeader>
      {clientIds.map(id => {
        return (
          <ClientItem
            key={id}
          >
            {id === currentBottomClient ? `${clients[id]}:${currentBid}` : clients[id]}
          </ClientItem>
        );
      })}
      <RegularButton
        id="finishBidBtn"
        label="Finish Bid"
        onClickCb={emitDoneBid}
      />
      {props.canSelectCardsForBottom &&
        <RegularButton
          id="finishBottomBtn"
          label="Finish Bottom"
          onClickCb={emitReturnBottom}
        />}
    </ClientsContainer>
  )
}

const mapStateToProps = state => {
  const name = getName(state);
  const clients = getExistingClients(state);
  const clientIds = getExistingClientIds(state);
  const currentBottomClient = getBottomClient(state);
  const currentBid = getCurrentBid(state);
  const cards = getMyCards(state);
  const canSelectCardsForBottom = getCanSelectCardsForBottom(state);

  const numStateChanges = updateState(state);
  return {
    name,
    cards,
    clients,
    clientIds,
    canSelectCardsForBottom,
    currentBottomClient,
    currentBid,
    numStateChanges
  };
}

const ClientsContainer = styled.ul`
  position: absolute;
  top: 10px;
  right: 0;
  transform: translateX(-25%);
  font-size: 24px;
  list-style: none;
`;

const ClientsHeader = styled.div`

`;

const ClientItem = styled.li`
  margin-left: 20px;
`;


export default connect(mapStateToProps, {
  updateCardsInHand,
  toggleBottomSelector
})(ConnectedClients);