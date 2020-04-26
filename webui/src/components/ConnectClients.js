import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import {
  getExistingClients,
  getExistingClientIds,
  getName,
  updateState,
  getBottomClient
} from '../redux/selectors';


const renderConnectedClients = (props) => {
  const {
    clientIds,
    clients,
    currentBottomClient
  } = props;

    return (
      <ClientsContainer>
        <ClientsHeader>Connected Users:</ClientsHeader>
        {clientIds.map((id, i) => {
          return (
            <ClientItem
            key={id}
          >
            {i}: {clients[id] === currentBottomClient ? clients[id] + " - BOTTOM" : clients[id]}
          </ClientItem>
          );
        })}
      </ClientsContainer>
    )
}

const mapStateToProps = state => {
  const clients = getExistingClients(state);
  const clientIds = getExistingClientIds(state);
  const numStateChanges = updateState(state);
  const currentBottomClient = getBottomClient(state);
  const name = getName(state);
  console.log(currentBottomClient);
  return {
    name,
    clients,
    clientIds,
    currentBottomClient,
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


export default connect(mapStateToProps)(renderConnectedClients);