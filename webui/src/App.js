import React, { Component } from "react";
import styled from 'styled-components';

import Game from './components/Game';

import { connectToSocket, getConnectedClients } from './socket/connect';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clients: {},
      socket: { connected: false },
      connectionStatus: false,
      name: '',
    };
  }

  setConnectionStatus(connectionStatus) {
    this.setState({ connectionStatus });
    if (connectionStatus) {
      getConnectedClients(this.setConnectedClients.bind(this));
    }
  }

  setConnectedClients(sockets) {
    console.log(sockets);
    this.setState({
      clients: sockets
    });
  }

  connect() {
    const id = this.nameRef.value;
    if (!id) {
      console.log('enter a name');
      return;
    }

    connectToSocket(this.setConnectionStatus.bind(this), id);
  }

  renderPreConnection() {
    return (
      <Container>
        <Title>
          Tractor
      </Title>
        <NameInput
          ref={(nameRef) => { this.nameRef = nameRef }}
        />
        <Button
          onClick={() => { this.connect() }}
        >
          Play
      </Button>
      </Container>
    );
  }

  renderPostConnection() {
    return (
      <Container>
        <ClientsContainer>
          abcdefg
        </ClientsContainer>
        <Game />
      </Container>
    );
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

const ClientsContainer = styled.div`
  position: absolute;
  top: 10px;
  font-size: 12px;
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

