import React, { Component } from "react";
import { connect } from 'react-redux';
import styled from 'styled-components';

import Game from './components/Game';
import GameButton from './components/GameButton';

import {
  connectToSocketIO,
  getConnectedClientsIO,
  makeBidIO
} from './socket/connect';

import {
  getExistingClients,
  getExistingClientIds,
  getName,
  updateState,
  getBottomClient
} from './redux/selectors';

import {
  updateClientList,
  setBottomClient,
  setName
} from './redux/actions';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      connectionStatus: false,
    };
  }

  setConnectionStatus(connectionStatus) {
    console.log('app', 2)
    this.setState({ connectionStatus });
    if (connectionStatus) {
      getConnectedClientsIO(this.setConnectedClients.bind(this));
    }
  }

  setConnectedClients(sockets) {
    console.log('app', 3)
    this.props.updateClientList(sockets);
  }
  
  setCurrentBottom(id) {
    // for when another client calls bottom
    console.log(id);
    this.props.setBottomClient(id);
  }

  setBottom() {
    // for this client to call bottom
    const { name } = this.props;
    // TODO: only allow call bottom when the correct trump is in hand
    makeBidIO(name);
    this.props.setBottomClient(name);
  }

  connect(ev) {
    ev.preventDefault();
    const id = this.nameRef.value;
    if (!id) {
      console.log('enter a name');
      return;
    }
    console.log('app', 1)
    connectToSocketIO(this.setConnectionStatus.bind(this), id);
    this.props.setName(id);
  }

  renderPreConnection() {
    return (
      <Container>
        <Title>
          Tractor
      </Title>
        <form
          onSubmit={(ev) => { this.connect(ev) }}
        >
          <NameInput
            autoFocus
            ref={(nameRef) => { this.nameRef = nameRef }}
          />
          <Button>
            Play  
          </Button>
        </form>
      </Container>
    );
  }


  renderPostConnection() {
    return (
      <Container>
        <ClientsContainer>
          <ClientsHeader>Connected Users:</ClientsHeader>
          {this.renderConnectedClients()}
        </ClientsContainer>
        <GameButton
          label={'Call Bottom'}
          onClickCb={this.setBottom.bind(this)}
        />
        <Game
          setCurrentBottomCb={this.setCurrentBottom.bind(this)}
        />
      </Container>
    );
  }

  renderConnectedClients() {
    const {
      clientIds,
      clients,
      currentBottomClient
    } = this.props;
    // console.log(clients[id], currentBottomClient)
    return clientIds.map((id, i) => {
      return (
        <ClientItem
          key={id}
        >
          {i}: {clients[id] === currentBottomClient ? clients[id] + " - BOTTOM" : clients[id]}
        </ClientItem>
      )
    });
  }


  render() {
    const { connectionStatus } = this.state;
    return connectionStatus ? this.renderPostConnection() : this.renderPreConnection();
  }
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

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: green;
`;

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

const Title = styled.h1`
  margin: 5px;
  padding: 0;
`;

const NameInput = styled.input`
  margin: 7px;
  padding: 4px;
  width: 7em;
`;

const Button = styled.button`
  padding: 3px 7px;
  height: auto;
  cursor: pointer;
`;

export default connect(mapStateToProps, {
  updateClientList,
  setBottomClient,
  setName
})(App);

