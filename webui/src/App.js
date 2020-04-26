import React, { Component } from "react";
import styled from 'styled-components';

import Game from './components/Game';
import GameButton from './components/GameButton';

import { connectToSocket, getConnectedClients, callBottom } from './socket/connect';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clients: {},
      clientIds: [],
      connectionStatus: false,
      name: '',
      currentBottomClient: null
    };
  }

  setConnectionStatus(connectionStatus) {
    this.setState({ connectionStatus });
    if (connectionStatus) {
      getConnectedClients(this.setConnectedClients.bind(this));
    }
  }

  setConnectedClients(sockets) {
    this.setState({
      clients: sockets,
      clientIds: Object.keys(sockets)
    });
  }

  
  setCurrentBottom(id) {
    // for when another client calls bottom
    this.setState({
      currentBottomClient: id
    });
  }

  setBottom() {
    // for this client to call bottom
    const { name } = this.state;
    // TODO: only allow call bottom when the correct trump is in hand
    callBottom(name);

    this.setState({
      currentBottomClient: name
    });
  }

  connect(ev) {
    ev.preventDefault();
    const id = this.nameRef.value;
    if (!id) {
      console.log('enter a name');
      return;
    }

    connectToSocket(this.setConnectionStatus.bind(this), id);
    this.setState({
      name: id
    });
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
    } = this.state;
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

export default App;

