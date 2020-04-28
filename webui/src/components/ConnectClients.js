import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import {
  getExistingClients,
  getExistingClientIds,
  getName,
  getCurrentBid,
  getBottomClient,
  updateState
} from '../redux/selectors';

const ConnectedClients = (props) => {
  const {
    clientIds,
    clients,
    currentBid,
    currentBottomClient
  } = props;
    // TODO: CHECK AGAINST ID FOR BOTTOM CALLS INSTEAD OF JUST THE NAME 
    return (
      <ClientsContainer>
        <ClientsHeader>Connected Users:</ClientsHeader>
        {clientIds.map((id, i) => {
          return (
            <ClientItem
            key={id}
          >
            {id === currentBottomClient ? `${clients[id]}:${currentBid}` : clients[id]}
          </ClientItem>
          );
        })}
      </ClientsContainer>
    )
}

const mapStateToProps = state => {
  const name = getName(state);
  const clients = getExistingClients(state);
  const clientIds = getExistingClientIds(state);
  const currentBottomClient = getBottomClient(state);
  const currentBid = getCurrentBid(state);

  const numStateChanges = updateState(state);
  return {
    name,
    clients,
    clientIds,
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


export default connect(mapStateToProps)(ConnectedClients);