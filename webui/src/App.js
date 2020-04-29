import React, { Component } from "react";
import { connect } from 'react-redux';
import styled from 'styled-components';

import Game from './components/Game';
import ConnectedClients from './components/ConnectedClients';
import ButtonsContainer from './components/ButtonsContainer';
import RegularButton from './components/RegularButton';

import TractorSvg from './tractor_logo.svg'

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
import PlayerInfo from "./components/PlayerInfo";

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
    let name = this.nameRef.value;
    if (!name) {
      console.log('enter a name');
      return;
    }
    if (name.length > 7) {
      name = name.slice(0, 7);
    }
    connectToSocketIO(this.setConnectionStatus.bind(this), name);
  }

  // TODO: create popup on error to enter a name if no name is entered
  renderPreConnection() {
    return (
      <Container>
        <Title>
          {/* Tractor */}
          <Logo
            src={TractorSvg}
            draggable={false}
          />
      </Title>
        <Form
          onSubmit={(ev) => { this.connect(ev) }}
        >
          <NameInput
            autoFocus
            placeholder="Enter a name!"
            ref={(nameRef) => { this.nameRef = nameRef }}
          />
          <RegularButton 
            label="Join"
          />
        </Form>
      </Container>
    );
  }


  renderPostConnection() {
    return (
      <Container>
        <PlayerInfo />
        <ConnectedClients />
        <ButtonsContainer />
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

const Form = styled.form`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const NameInput = styled.input`
  margin: 5px 15px;
  padding: 7px 10px;
  outline: none;
  border: transparent 2px solid;
  border-radius: 2px 2px 0 0;
  width: 100px;
  height: 15px;
  background-color: darkgreen;
  color: rgba(255, 255, 255, .9);
  transition: all .3s cubic-bezier(0.65, 0, 0.35, 1);

  &::placeholder {
    color: rgba(255, 255, 255, .7);
  }

  &:focus, &:active {
    border-bottom: rgba(255, 255, 255, .7) 2px solid;
  }
`;

const Logo = styled.img`
  width: 150px;
`;

export default connect(mapStateToProps, {
  updateClientList,
  setUser
})(App);

