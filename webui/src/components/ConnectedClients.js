import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import {
  getExistingClients,
  getExistingClientIds,
  getClientTurn,
  getScreenSize,
  getRoom,
  getId,
  getName,
  updateState
} from '../redux/selectors';

const ConnectedClients = (props) => {
  const {
    myId,
    name,
    appHeight,
    appWidth,
    clientIds,
    roomName,
    clients,
  } = props;

  useEffect(() => {
    document.title = name;
  });

  const renderClientStatus = (id) => {
    const { clientTurn } = props;
    let outputString = '';
    if (clientTurn === id) {
      outputString = 'Waiting for '
    }
    if (id === myId) {
      outputString += `you`;
    } else {
      outputString += clients[id];
    }
    return outputString
  }

  // TODO: show player levels as well as level
  return (
    <ClientsContainer
      isMobile={appHeight > appWidth}
    >
      <ClientsHeader>PLAYERS ({roomName})</ClientsHeader>
      {clientIds.map(id => {
        return (
          <ClientItem
            key={id}
          >
          {renderClientStatus(id)}
          </ClientItem>
        );
      })}
    </ClientsContainer>
  )
}

const mapStateToProps = state => {
  const myId = getId(state);
  const name = getName(state);
  const clients = getExistingClients(state);
  const clientIds = getExistingClientIds(state);
  const roomName = getRoom(state);
  const { appWidth, appHeight } = getScreenSize(state);
  const clientTurn = getClientTurn(state);

  const numStateChanges = updateState(state);
  return {
    myId,
    name,
    clients,
    roomName,
    appWidth,
    appHeight,
    clientTurn,
    clientIds,
    numStateChanges
  };
}

const ClientsContainer = styled.ul`
  position: fixed;
  transform: ${props => props.isMobile ? '' : 'translateX(-25%)'};
  top: ${props => props.isMobile ? '145px' : '10px'};
  right: 0;
  padding: 10px 30px 10px 10px;
  margin: 5px;
  width: 150px;
  border-radius: 5px;
  background-color: rgba(0,0,0, .20);
  color: rgba(255, 255, 255, .6);
  font-size: 18px;
  list-style: none;
`;

const ClientsHeader = styled.div`
  padding-bottom: 5px;
  font-weight: 500;
`;

const ClientItem = styled.li`
  padding: 0 5px;
  font-size: 14px;
  font-weight: 400;
  text-indent: -2px;

  &::before {
    content: "🚜 ";
  }
`;


export default connect(mapStateToProps)(ConnectedClients);