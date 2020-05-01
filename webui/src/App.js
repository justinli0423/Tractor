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
      iconWidth: 150,
      inputWidth: 100,
      screenWidth: 1920,
      screenHeight: 1080,
      isSupported: true
    };

    window.addEventListener('resize', this.setAppSizes.bind(this));
    // screen.orientation.lock('landscape');
  }

  componentDidMount() {
    this.setAppSizes();
  }

  setAppSizes() {
    let screenWidth = window.innerWidth;
    let screenHeight = window.innerHeight;
    let isSupported = true;
    let appWidth, appHeight, iconWidth, inputWidth;


    if (screenWidth >= 2560 && screenHeight >= 1440) {
      appWidth = 2560;
      appHeight = 1440;
      iconWidth = 250;
      inputWidth = 170;
    } else if (screenWidth >= 1920 && screenHeight >= 1080) {
      appWidth = 1920;
      appHeight = 1080;
      iconWidth = 150;
      inputWidth = 100;
    } else if (screenWidth >= 1194 && screenHeight >= 690) { // regular 720p and ipad pro
      appWidth = 1280;
      appHeight = 720;
      iconWidth = 150;
      inputWidth = 100;
    } else {
      isSupported = false;
    }

    this.props.setScreenSize(appWidth, appHeight);
    this.setState({
      iconWidth,
      inputWidth,
      screenWidth,
      screenHeight,
      isSupported
    })
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
    const {
      appHeight,
      appWidth
    } = this.props;
    const {
      iconWidth,
      inputWidth
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
          <NameInput
            autoFocus
            placeholder="Enter a name!"
            inputWidth={inputWidth}
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

  renderNotSupported() {
    const { 
      screenWidth,
      screenHeight
    } = this.state;
    return (
      <h2>Device ({screenWidth}x{screenHeight}) is currently unsupported.</h2>
    )
  }

  render() {
    const {
      connectionStatus,
      isSupported
    } = this.state;
    if (isSupported) {
      return connectionStatus ? this.renderPostConnection() : this.renderPreConnection();
    } else {
      return this.renderNotSupported();
    }
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
  flex-direction: row;
  align-items: center;
`;

const NameInput = styled.input`
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

