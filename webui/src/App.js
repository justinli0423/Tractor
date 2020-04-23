import React, { Component } from "react";
import styled from 'styled-components';

import Game from './components/Game';

import { connectToSocket, setSocketID } from './socket/connect';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: {connected: false},
      connectionStatus: false,
      name: '',
    };
  }

  componentDidUpdate() {
    const { socket } = this.state;
    socket.on('connectionStatus', (connectionStatus) => {
      this.setState({
        connectionStatus
      })
    })
  }

  connect() {
    const id = this.refs.nameRef.value;
    if (!id) {
      console.log('enter a name');
      return;
    }

    let socket = connectToSocket();
    setSocketID(id);
    this.setState({ socket });
  }

  renderPreConnection() {
    return (
      <Container>
        <Title>
          Tractor
      </Title>
        <NameInput
          ref="nameRef"
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

