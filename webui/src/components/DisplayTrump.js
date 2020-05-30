import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { startNewRoundIO } from '../socket/connect';

import {
  getExistingClients,
  getCurrentBid,
  getMyCards,
  getTrumpValue,
  getPoints,
  getBottomClient,
  getCanStartNewRound,
  getScreenSize,
  updateState
} from '../redux/selectors';

import {
  setCanStartRound
} from '../redux/actions';

import RegularButton from './RegularButton';
import Cards from '../utils/Cards';

class DisplayTrump extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bidHistory: [],
      updateComponent: 0
    };
  }

  componentDidUpdate(prevProps) {
    const {
      currentBid,
      currentBottomClient
    } = this.props;
    const {
      bidHistory,
      updateComponent
    } = this.state;
    const prevBottomClient = prevProps.currentBottomClient;
    const prevBid = prevProps.currentBid;

    if (JSON.stringify(prevBid) === JSON.stringify(currentBid) &&
      JSON.stringify(currentBottomClient) === JSON.stringify(prevBottomClient)) {
      return;
    }

    if (!currentBid || currentBid.length === 0) {
      this.setState({
        bidHistory: []
      });
      return;
    }

    bidHistory.push([currentBottomClient, currentBid]);

    this.setState({
      bidHistory
    });

    if (prevBottomClient) {
      setTimeout(() => {
        bidHistory.shift();
        this.setState({
          bidHistory,
          updateComponent: updateComponent + 1
        })
      }, 5000);
    }
  }

  getTrumpCardSvgs(currentBid) {
    const {
      trumpValue,
      appWidth,
      appHeight
    } = this.props;
    const Card = new Cards('/cardsSVG/');
    const allSvgs = [];
    let svg;

    if (currentBid && currentBid.length) {
      if (currentBid[1] === 'J') {
        svg = Card.getSvg(currentBid);
        for (let i = 0; i < 2; i++) {
          allSvgs.push(<SvgContainer isMobile={appHeight > appWidth} src={svg} />);
        }
      } else {
        svg = Card.getSvg([trumpValue, currentBid[1]]);
        for (let i = 0; i < currentBid[0]; i++) {
          allSvgs.push(<SvgContainer isMobile={appHeight > appWidth} src={svg} />);
        }
      }
    }

    return allSvgs;
  }

  render() {
    const {
      clients,
      appHeight,
      appWidth,
      points,
      canStartNewRound,
      setCanStartRound,
    } = this.props;
    const { bidHistory } = this.state;
    return (
      <ClientsContainer
        isMobile={appHeight > appWidth}
      >
        {canStartNewRound && (
          <RegularButton
            margin='2px 0 7px'
            label='Start Round'
            onClickCb={() => {
              startNewRoundIO();
              setCanStartRound(false);
            }}
          />
        )}
        <ClientsHeader>
          POINTS: {points}
        </ClientsHeader>
        <ClientsHeader>TRUMP</ClientsHeader>
        {bidHistory.length ? bidHistory.map(bidArr => (
          <ClientItem>
            {clients[bidArr[0]]}: {this.getTrumpCardSvgs(bidArr[1])}
          </ClientItem>
        )) : 'Undetermined'}
      </ClientsContainer>
    )
  }
}

const mapStateToProps = state => {
  const clients = getExistingClients(state);
  const currentBottomClient = getBottomClient(state);
  const currentBid = getCurrentBid(state);
  const points = getPoints(state);
  const trumpValue = getTrumpValue(state);
  const canStartNewRound = getCanStartNewRound(state);
  const { appWidth, appHeight } = getScreenSize(state);
  const myCards = getMyCards(state);
  const numStateChanges = updateState(state);
  return {
    clients,
    myCards,
    currentBid,
    appWidth,
    appHeight,
    trumpValue,
    canStartNewRound,
    points,
    currentBottomClient,
    numStateChanges
  };
}

const ClientsContainer = styled.ul`
  position: fixed;
  box-sizing: border-box;
  transform: ${props => props.isMobile ? '' : 'translateX(25%)'};
  top: ${props => props.isMobile ? '145px' : '10px'};
  left: 0;
  margin: 5px;
  padding: 10px 30px 10px 10px;
  width: ${props => props.isMobile ? '150px' : '200px'};
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
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  padding: 0 5px;
  font-size: 14px;
  font-weight: 400;
  text-indent: -2px;

  &::before {
    content: "🚜 ";
  }
`;

const SvgContainer = styled.img`
  margin: 0 5px;
  width: ${props => props.isMobile ? '30px' : '40px'};
  height: ${props => props.isMobile ? '40px' : '60px'};
  
  &:nth-child(n + 2) {
    margin: 0 -20px;
  }
`;

export default connect(mapStateToProps, {
  setCanStartRound
})(DisplayTrump);