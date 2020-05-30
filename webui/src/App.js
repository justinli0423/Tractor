import React, { Component } from "react";
import { connect } from 'react-redux';
import styled from 'styled-components';

import Game from './components/Game';
import ConnectedClients from './components/ConnectedClients';
import DisplayTrump from "./components/DisplayTrump";
import ButtonsContainer from './components/ButtonsContainer';
import RegularButton from './components/RegularButton';
import PlayerInfo from "./components/PlayerInfo";

import TractorSvg from './tractor_logo.svg'

import {
  connectToSocketIO,
  getConnectedClientsIO,
} from './socket/connect';

import {
  getName,
  getScreenSize,
  updateState
} from './redux/selectors';

import {
  updateClientList,
  setScreenSize,
  setUser
} from './redux/actions';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      connectionStatus: false,
      isConnecting: false,
      iconWidth: 150,
      inputWidth: 100
    };

    window.addEventListener('resize', this.setAppSizes.bind(this));
  }

  componentDidMount() {
    this.setAppSizes();
  }

  setAppSizes() {
    let screenWidth = window.innerWidth;
    let screenHeight = window.innerHeight;
    let appWidth, appHeight, iconWidth, inputWidth;

    if (screenWidth >= 2560 && screenHeight >= 1440) {
      appWidth = 2560;
      appHeight = 1440;
      iconWidth = 250;
      inputWidth = 200;
    } else if (screenWidth >= 1920 && screenHeight >= 1080) {
      appWidth = 1920;
      appHeight = 1080;
      iconWidth = 150;
      inputWidth = 130;
    } else if (screenWidth < screenHeight) {
      // mobile
      appWidth = screenWidth;
      appHeight = screenHeight;
      iconWidth = 150;
      inputWidth = 130;
    } else {
      appWidth = 1280;
      appHeight = 720;
      iconWidth = 150;
      inputWidth = 130;
    }

    this.props.setScreenSize(appWidth, appHeight);
    this.setState({
      iconWidth,
      inputWidth
    })
  }

  setConnectionStatus(connectionStatus, id, name, roomName) {
    this.setState({ connectionStatus });
    if (connectionStatus) {
      getConnectedClientsIO(this.setConnectedClients.bind(this));
      this.props.setUser(name, id, roomName);
    }
  }

  setConnectedClients(sockets) {
    this.props.updateClientList(sockets);
  }

  joinRoomValidator(isConnected) {
    if(!isConnected) {
      alert('Room is full.');
      this.setState({
        connectionStatus: false
      });
    }
    this.setState({
      isConnecting: false
    });
  }

  connect(ev) {
    ev.preventDefault();
    let name = this.nameRef.value;
    let room = this.roomRef.value;
    if (!name) {
      alert('enter a name');
      return;
    }
    if (!room) {
      alert('enter a room');
      return;
    }

    if (name.length > 7) {
      name = name.slice(0, 7);
    }

    this.setState({
      isConnecting: true
    });

    connectToSocketIO(this.setConnectionStatus.bind(this), this.joinRoomValidator.bind(this), name, room);
  }

  renderPreConnection() {
    const {
      appHeight,
      appWidth
    } = this.props;
    const {
      iconWidth,
      inputWidth,
      isConnecting
    } = this.state;
    return (
      <Container
        width={appWidth}
        height={appHeight}
      >
        <Title>
          {/* Tractor */}
          <Logo
            iconWidth={iconWidth}
            src={TractorSvg}
            draggable={false}
          />
        </Title>
        <Form
          onSubmit={(ev) => { this.connect(ev) }}
        >
          <Input
            autoFocus
            placeholder="Enter a name!"
            inputWidth={inputWidth}
            ref={(nameRef) => { this.nameRef = nameRef }}
          />
          <Input
            placeholder="Enter a room code!"
            inputWidth={inputWidth}
            ref={(roomRef) => { this.roomRef = roomRef }}
          />
          <RegularButton
            label="Join"
            disabled={isConnecting}
          />
        </Form>
      </Container>
    );
  }


  renderPostConnection() {
    const {
      appHeight,
      appWidth
    } = this.props;
    return (
      <Container
        width={appWidth}
        height={appHeight}
      >
        <PlayerInfo />
        <DisplayTrump />
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
  const { appWidth, appHeight } = getScreenSize(state);
  return {
    name,
    appWidth,
    appHeight,
    numStateChanges,
  };
}

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: ${props => `${props.width}px`};
  height: ${props => `${props.height}px`};
  background-color: green;
`;

const Title = styled.h1`
  margin: 5px;
  padding: 0;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Input = styled.input`
  margin: 5px 15px;
  padding: 7px 10px;
  outline: none;
  border: transparent 2px solid;
  border-radius: 2px 2px 0 0;
  width: ${prop => `${prop.inputWidth}px`};
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
  width: ${prop => `${prop.iconWidth}px`};
`;

export default connect(mapStateToProps, {
  updateClientList,
  setScreenSize,
  setUser
})(App);

