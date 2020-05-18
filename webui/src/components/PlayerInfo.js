import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

import Cards from '../utils/Cards';

import {
  getId,
  getExistingClients,
  getExistingClientIds,
  getClientTurn,
  getExistingTricks,
  getScreenSize,
  getCurrentTrickWinner,
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
    currentClientTurn,
  } = props;
  const filteredClientIds = [];
  const myIndex = clientIds.indexOf(myId);
  for (let i = 1; i < 4; i++) {
    filteredClientIds.push(clientIds[(myIndex + i) % 4]);
  }


  const player1 = (clientName, clientId, cardSvg) => {
    return (
      <Container1
        curWinner={currentTrickWinner}
        clientTurn={currentClientTurn}
        myId={clientId}
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

  const player2 = (clientName, clientId, cardSvg) => {
    return (
      <Container2
        curWinner={currentTrickWinner}
        clientTurn={currentClientTurn}
        myId={clientId}
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

  const player3 = (clientName, clientId, cardSvg) => {
    return (
      <Container3
        curWinner={currentTrickWinner}
        clientTurn={currentClientTurn}
        myId={clientId}
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

    return (index === 0) ? player1(clientName, clientId, allSvgs) :
      (index === 1) ? player2(clientName, clientId, allSvgs) :
        player3(clientName, clientId, allSvgs);
  }

  return (
    <>
      <PlayerSignal
        myId={myId}
        clientTurn={currentClientTurn}
      >
        Go
      </PlayerSignal>
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
  const currentClientTurn = getClientTurn(state);
  const currentTrickWinner = getCurrentTrickWinner(state);
  const { appWidth, appHeight } = getScreenSize(state);
  const updateNumState = updateState(state);
  return {
    myId,
    clients,
    clientIds,
    currentTrickWinner,
    currentClientTurn,
    existingTricks,
    appWidth,
    appHeight,
    updateNumState
  }
}

const flash = keyframes`
  from {
    rgba(0,0,0, .30);
  }

  to {
    rgba(0,0,0, .10);
  }
`;

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
  border: ${props => (props.clientTurn && props.myId === props.clientTurn) ? '2px solid red' : '2px solid transparent'};
  margin-left: 30px;
  animation: ${props => (props.currentTrickWinner === props.myId) ? `${flash} 1s linear infinite` : ''};
`;

const Container2 = styled(Container)`
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  border: ${props => (props.clientTurn && props.myId === props.clientTurn) ? '2px solid red' : '2px solid transparent'};
  margin-top: 30px;
  animation: ${props => (props.currentTrickWinner === props.myId) ? `${flash} 1s linear infinite` : ''};
`;

const Container3 = styled(Container)`
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  border: ${props => (props.clientTurn && props.myId === props.clientTurn) ? '2px solid red' : '2px solid transparent'};
  margin-right: 30px;
  animation: ${props => (props.currentTrickWinner === props.myId) ? `${flash} 1s linear infinite` : ''};
`;

const PlayerSignal = styled.div`
  z-index: 0;
  position: absolute;
  display: ${props => props.myId === props.clientTurn ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  background-color: transparent;
  color: rgba(255, 255, 255, .1);
  font-size: 20rem;
`;


export default connect(mapStateToProps)(PlayerInfo);