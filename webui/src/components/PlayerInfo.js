import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

import Cards from '../utils/Cards';

import {
  getId,
  getExistingClients,
  getExistingClientIds,
  getTrumpValue,
  getBottomClient,
  getCurrentBid,
  updateState
} from '../redux/selectors';


// make position fixed for the 4 players
const PlayerInfo = (props) => {
  const {
    myId,
    clients,
    clientIds,
    bottomClient,
    trumpValue,
    currentBid,
  } = props;
  const filteredClientIds = clientIds.filter(id => id !== myId);

  // keep track of bidding history as well...

  const player1 = (clientName, playerId, cardSvg) => {
    if (bottomClient === playerId) {
      return (
        <Container1>
          <Name> {clientName}: </Name>
          {cardSvg}
        </Container1>
      )
    }
    return (
      <Container1>
        {filteredClientIds[0] ? clientName : 'Waiting for P1...'}
      </Container1>
    )
  }

  const player2 = (clientName, playerId, cardSvg) => {
    if (bottomClient === playerId) {
      return (
        <Container2>
          <Name> {clientName}: </Name>
          {cardSvg}
        </Container2>
      )
    }
    return (
      <Container2>
        {filteredClientIds[1] ? clientName : 'Waiting for P2...'}
      </Container2>
    )
  }

  const player3 = (clientName, playerId, cardSvg) => {
    if (bottomClient === playerId) {
      return (
        <Container3>
          <Name> {clientName}: </Name>
          {cardSvg}
        </Container3>
      )
    }
    return (
      <Container3>
        {filteredClientIds[2] ? clientName : 'Waiting for P3...'}
      </Container3>
    )
  }

  const renderPlayerInfo = (index) => {
    const Card = new Cards('/cardsSVG/');
    const clientId = filteredClientIds[index];
    const clientName = clients[clientId];
    const allSvgs = [];
    let svg;

    // TODO: distinguish bottom bids vs regular tricks
    // TODO: does not show regular tricks yet
    if (currentBid && currentBid.length) {
      if (currentBid[1] === 'J') {
        svg = Card.getSvg(currentBid);
        // call with 2 jokers only
        for(let i = 0; i < 2; i++) {
          allSvgs.push(<SvgContainer src={svg}/>);
        }
      } else {
        svg = Card.getSvg([trumpValue, currentBid[1]]);
        for(let i = 0; i < currentBid[0]; i++) {
          allSvgs.push(<SvgContainer src={svg} />);
        }
      }
    }

    return (index === 0) ? player1(clientName, clientId, allSvgs) :
      (index === 1) ? player2(clientName, clientId, allSvgs) :
        player3(clientName, clientId, allSvgs);
  }

  return (
    <>
      {renderPlayerInfo(0)}
      {renderPlayerInfo(1)}
      {renderPlayerInfo(2)}
    </>
  )
};

const mapStateToProps = (state) => {
  const myId = getId(state);
  const clients = getExistingClients(state);
  const clientIds = getExistingClientIds(state);
  const bottomClient = getBottomClient(state);
  const trumpValue = getTrumpValue(state);
  const currentBid = getCurrentBid(state);
  const updateNumState = updateState(state);

  return {
    myId,
    clients,
    clientIds,
    bottomClient,
    trumpValue,
    currentBid,
    updateNumState
  }
}

const Container = styled.div`
  position: fixed;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 30px;
  width: auto;
  padding: 10px 30px 10px 10px;
  border-radius: 5px;
  font-size: 32px;
  background-color: rgba(0,0,0, .20);
  color: rgba(255, 255, 255, .6);
`;

const SvgContainer = styled.img`
  margin: 0 5px;
  width: 60px;
  height: 90px;
  
  &:nth-child(n + 2) {
    margin: 0 -20px;
  }
`;

const Name = styled.span`
  margin-right: 30px;
`;

const Container1 = styled(Container)`
  top: 50%;
  left: 0;
  transform: translateY(-50%);
`;

const Container2 = styled(Container)`
  top: 0;
  left: 50%;
  transform: translateX(-50%);
`;

const Container3 = styled(Container)`
  top: 50%;
  right: 0;
  transform: translateY(-50%);
`;


export default connect(mapStateToProps)(PlayerInfo);