import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

import Cards from '../utils/Cards';

import {
  getId,
  getExistingClients,
  getExistingClientIds,
  getExistingTricks,
  getScreenSize,
  updateState
} from '../redux/selectors';

// TODO: clear all info when trick round is done (determined by listener)
// make position fixed for the 4 players
const PlayerInfo = (props) => {
  const {
    myId,
    clients,
    clientIds,
    appWidth,
    existingTricks,
  } = props;
  const filteredClientIds = [];
  const myIndex = clientIds.indexOf(myId);
  for(let i = 1; i < 4; i++) {
    filteredClientIds.push(clientIds[(myIndex + i) % 4]);
  }


  const player1 = (clientName, cardSvg) => {
    return (
      <Container1
        appWidth={appWidth}
      >
        {filteredClientIds[0] ?
          <> 
            <Name>
              {clientName}: 
            </Name>
            {cardSvg}
          </> : 'Waiting for Player...'}
      </Container1>
    )
  }

  const player2 = (clientName, cardSvg) => {
    return (
      <Container2
        appWidth={appWidth}
      >
        {filteredClientIds[1] ?
          <> 
            <Name>
              {clientName}: 
            </Name>
            {cardSvg}
          </> : 'Waiting for Player...'}
      </Container2>
    )
  }

  const player3 = (clientName, cardSvg) => {
    return (
      <Container3
        appWidth={appWidth}
      >
        {filteredClientIds[2] ?
          <> 
            <Name>
              {clientName}: 
            </Name>
            {cardSvg}
          </> : 'Waiting for Player...'}
      </Container3>
    )
  }

  const renderPlayerInfo = (index) => {
    const Card = new Cards('/cardsSVG/');
    const clientId = filteredClientIds[index];
    const clientName = clients[clientId];
    const clientCards = existingTricks[clientId];
    const allSvgs = [];
    let svg;

    if (clientCards && clientCards.length > 0) {
      clientCards.forEach(card => {
        svg = Card.getSvg(card);
        allSvgs.push(<SvgContainer src={svg} />)
      })
    }

    return (index === 0) ? player1(clientName, allSvgs) :
      (index === 1) ? player2(clientName, allSvgs) :
        player3(clientName, allSvgs);
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
  const existingTricks = getExistingTricks(state);
  const { appWidth, appHeight } = getScreenSize(state);
  const updateNumState = updateState(state);
  
  return {
    myId,
    clients,
    clientIds,
    existingTricks,
    appWidth,
    appHeight,
    updateNumState
  }
}

const Container = styled.div`
  position: fixed;
  display: flex;
  flex-direction: row;
  align-items: center;
  width: auto;
  min-width: 200px;
  height: 90px;
  padding: 10px 30px 10px 10px;
  border-radius: 5px;
  font-size: 24px;
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
  margin-left: 30px;
`;

const Container2 = styled(Container)`
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 30px;
`;

const Container3 = styled(Container)`
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  margin-right: 30px;
`;


export default connect(mapStateToProps)(PlayerInfo);