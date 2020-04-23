import React, { Component } from "react";
import styled from 'styled-components';

import Game from './components/Game';

import { connectToSocket } from './socket/connect';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: {connected: false},
    };
  }

  connect() {
    let socket = connectToSocket();
    this.setState({
      socket,
      connectionStatus: socket.connected
    });
  }

  renderPreConnection() {
    return (
      <Container>
        <Title>
          Tractor
      </Title>

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
        <Game />
      </Container>
    );
  }

  render() {
    const { socket } = this.state;
    console.log(socket.connected);
    return socket.connected ? this.renderPostConnection() : this.renderPreConnection();
  }
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: green;
`;

const Title = styled.h1`
  margin: 5px;
  padding: 0;
`;

const Button = styled.button`
  padding: 3px 7px;
  height: auto;
  cursor: pointer;
`;

export default App;

