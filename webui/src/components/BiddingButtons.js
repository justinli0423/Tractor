import React from 'react';
import { connect } from 'react-redux';

import GameButton from './GameButton';
import Unicodes from '../utils/Unicodes';
import PlayingCards from '../utils/Cards';

import {
    makeBidIO
} from '../socket/connect';

// TODO: remove setvalidbids from here
import {
    setCurrentBid,
    setValidBids
} from '../redux/actions';

import {
    getName,
    getId,
    getValidBids,
    getCurrentBid,
    getTrumpValue,
    getTrumpTracker,
    updateState
} from '../redux/selectors';

const Cards = new PlayingCards();

const CallBottomButtons = (props) => {
    // TODO: 1. pass correct value
    // TODO: 2. remove invalid bids

    // e.g. if I have 2 (2 of spades) -> [2, 'S'];
    // e.g. no trump: ['S', 'J'] or ['B', 'J']
    const setBottom = (bid) => {
        const {
            id,
            trumpTracker,
            validBids,
        } = props;
        const bidString = `${bid[0]}${bid[1]}`;
        makeBidIO(bid);
        props.setCurrentBid(id, bidString);
        // console.log(Cards)
        Cards.updateBid(bid, trumpTracker, validBids);
    }

    // returns the array of buttons to be rendered
    // TODO: keep track of previous bids before rendering
    const getAvailableBidButtons = () => {
        const { validBids } = props;
        // console.log(validBids);
        // validBids: [numOfCards, valueOfCards]
        // e.g. if I have 2 (2 of spades) -> [2, 'S'];
        // e.g. no trump: ['S', 'J'] or ['B', 'J']
        let bidArray = [];
        validBids.forEach(bid => {
            let buttonObject = {
                rawData: bid
            };
            if (bid[1] === 'J') { // have 2 jokers to call no trump
                bidArray.push(Object.assign({}, buttonObject, {
                    renderData: bid[0] === 'S' ? ['No Trump', 'SJ'] : ['No Trump', 'BJ'],
                    color: bid[0] === 'S' ? 'black' : 'red'
                }));
            } else {
                // for (let i = 0; i < bid[0]; i++) {
                //     bidArray.push(Object.assign({}, buttonObject, {
                //         renderData: [i + 1, bid[1]],
                //         color: (bid[1] === 'S' || bid[1] === 'C') ? 'black' : 'red'
                //     }));
                // }
                bidArray.push(Object.assign({}, buttonObject, {
                    renderData: [bid[0], bid[1]],
                    color: (bid[1] === 'S' || bid[1] === 'C') ? 'black' : 'red'
                }));
            }
        })
        // console.log(bidArray);
        return bidArray;    
    }


    return (
        <>
            {
                getAvailableBidButtons().map((buttonObject, i) => {
                    return (
                        <GameButton
                            bid={buttonObject.rawData}
                            label={buttonObject.renderData[0]}
                            icon={Unicodes[buttonObject.renderData[1]] || ''}
                            color={buttonObject.color}
                            onClickCb={setBottom}
                            key={i}
                        />
                    )
                })
            }
        </>
    );
}


const mapStateToProps = (state) => {
    const name = getName(state);
    const id = getId(state);
    const validBids = getValidBids(state);
    const trumpValue = getTrumpValue(state);
    const trumpTracker = getTrumpTracker(state);
    const currentBid = getCurrentBid(state);
    const numUpdateStates = updateState(state);
    return {
        id,
        name,
        validBids,
        currentBid,
        trumpValue,
        trumpTracker,
        numUpdateStates
    };
}

export default connect(mapStateToProps, {
    setCurrentBid,
    setValidBids
})(CallBottomButtons);