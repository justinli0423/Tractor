import React, { Component } from "react";
import { connect } from 'react-redux';
import styled from 'styled-components';

import Game from './components/Game';
import ConnectedClients from './components/ConnectClients';
import BiddingButtons from './components/BidButton';
import RegularButton from './components/RegularButton';

import {
  connectToSocketIO,
  getConnectedClientsIO,
} from './socket/connect';

import {
  getName,
  updateState
} from './redux/selectors';

import {
  updateClientList,
  setUser
} from './redux/actions';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      connectionStatus: false,
    };
  }

  setConnectionStatus(connectionStatus, id, name) {
    this.setState({ connectionStatus });
    if (connectionStatus) {
      getConnectedClientsIO(this.setConnectedClients.bind(this));
      this.props.setUser(name, id);
    }
  }

  setConnectedClients(sockets) {
    this.props.updateClientList(sockets);
  }

  connect(ev) {
    ev.preventDefault();
    const name = this.nameRef.value;
    if (!name) {
      console.log('enter a name');
      return;
    }
    connectToSocketIO(this.setConnectionStatus.bind(this), name);
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
          <RegularButton 
            label="Play"
          />
        </form>
      </Container>
    );
  }


  renderPostConnection() {
    return (
      <Container>
        <ConnectedClients />
        <BiddingButtons />
        <Game />
      </Container>
    );
  }

  render() {
    const { connectionStatus } = this.state;
    return connectionStatus ? this.renderPostConnection() : this.renderPreConnection();
  }
}

const mapStateToProps = state => {
  const name = getName(state);
  const numStateChanges = updateState(state);
  return {
    name,
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

const Title = styled.h1`
  margin: 5px;
  padding: 0;
`;

const NameInput = styled.input`
  margin: 7px;
  padding: 4px;
  width: 7em;
`;

export default connect(mapStateToProps, {
  updateClientList,
  setUser
})(App);

