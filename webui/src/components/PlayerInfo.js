import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

import {
  getExistingClients,
  getExistingClientIds,
  updateState
} from '../redux/selectors';

// make position fixed for the 4 players
const PlayerInfo = (props) => {
  const {
    clientIds,
    clients
  } = props;
  const player1 = () => {
    return (
      <Container1>
      {clientIds[1] ? renderPlayerInfo(clientIds[1]) : 'Waiting for PLAYER 1...'}
    </Container1>
    )
  }

  const player2 = () => {
    return (
      <Container2>
      {clientIds[2] ? renderPlayerInfo(clientIds[2]) : 'Waiting for PLAYER 2...'}
    </Container2>
    )
  }

  const player3 = () => {
    return (
      <Container3>
      {clientIds[3] ? renderPlayerInfo(clientIds[3]) : 'Waiting for PLAYER 3...'}
    </Container3>
    )
  }

  const renderPlayerInfo = (clientId, index) => {
    const clientName = clients[clientIds[clientId]];

    
  }

  return(
    <>
      {clientIds[1] && renderPlayerInfo(clientIds[1], 1)}
      {clientIds[2] && renderPlayerInfo(clientIds[2], 2)}
      {clientIds[3] && renderPlayerInfo(clientIds[3], 3)}
    </>
  )
};

const mapStateToProps = (state) => {
  const clients = getExistingClients(state);
  const clientIds = getExistingClientIds(state);
  const updateNumState = updateState(state);

  return {
    clients,
    clientIds,
    updateNumState
  }
}

const Container = styled.div`
  position: fixed;
  margin: 30px;
  width: 350px;
  font-size: 32px;
  color: rgba(255, 255, 255, .6);
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