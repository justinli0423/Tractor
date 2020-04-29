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

  // TODO: ADD STATE FOR NUM CARDS SELECTED FOR BOTTOM FOR BUTTON TOGGLE AFTER 8 CARDS ARE SELECTED
  return (
    <ClientsContainer>
      <ClientsHeader>PLAYERS</ClientsHeader>
      {clientIds.map(id => {
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
    currentBid,
    currentBottomClient,
    numStateChanges
  };
}

const ClientsContainer = styled.ul`
  position: absolute;
  transform: translateX(-25%);
  top: 10px;
  right: 0;
  padding: 10px 30px 10px 10px;
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