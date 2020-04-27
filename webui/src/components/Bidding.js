import React from 'react';
import {connect} from 'react-redux';
import styled from 'styled-components';

import GameButton from './GameButton';

import {
    makeBidIO
} from '../socket/connect';

import {
    setBottomClient,
} from '../redux/actions';

import {
    getName,
    getId,
    updateState
} from '../redux/selectors';

const CallBottomButtons = (props) => {

    const setBottom = () => {
        // for this client to call bottom
        const {id} = props;
        // TODO: only allow call bottom when the correct trump is in hand
        // FAKED HEARTS AS SUIT FOR NOW
        makeBidIO('H');
        props.setBottomClient(id);
    }

    return (
        < GameButton
    label = {'Bid'}
    onClickCb = {setBottom}
    />
)
    ;
}

const mapStateToProps = (state) => {
    const name = getName(state);
    const numUpdateStates = updateState(state);
    const id = getId(state);

    return {
        id,
        name,
        numUpdateStates
    }
}

export default connect(mapStateToProps, {
    setBottomClient
})(CallBottomButtons);

// want to store trump value cards and jokers
// playerhands = {'S':0, 'D':0, 'C':0, 'H':0, 'SJ': 0, 'BJ':0}

// keep list of possible bids
//

function newCard(card, trumpValue, playerHand, playerBids) {
    if (card[1] === 'J') {
        playerHand[card[0] + 'J'] += 1
        if (playerHand[card[0] + 'J'] === 2) {
            playerBids.push(card)
        }
    } else if (card[0] === trumpValue) {
        playerHand[card[1]] += 1
        playerBids.push([playerHand[card[1]], card[1]])
    }
}

// this client bid
function newValidBids(bid, playerHand, playerBids) {
    playerBids.splice(0, playerBids.length)
    if (bid[0] === 1) {
        if (playerHand[bid[1]] === 2) {
            playerBids.push([2, bid[1]])
        }
    }
}


// someone else called trump
function updateValidBids(bid, playerHand, playerBids) {
    playerBids.splice(0, playerBids.length)
    if (bid !== ['B', 'J']) {
        if (playerHand['BJ'] === 2) {
            playerBids.push(['B', 'J'])
        }
    } else {
        return
    }
    if (bid !== ['S', 'J']) {
        if (playerHand['SJ'] === 2) {
            playerBids.push(['S', 'J'])
        }
    } else {
        return
    }
    if (bid[0] !== 2) {
        if (playerHand['S'] === 2) {
            playerBids.push([2, 'S'])
        }
        if (playerHand['D'] === 2) {
            playerBids.push([2, 'D'])
        }
        if (playerHand['C'] === 2) {
            playerBids.push([2, 'C'])
        }
        if (playerHand['H'] === 2) {
            playerBids.push([2, 'H'])
        }
    }
}

