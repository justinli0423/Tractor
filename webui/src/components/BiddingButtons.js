import React from 'react';
import { connect } from 'react-redux';

import GameButton from './GameButton';
import Unicodes from '../utils/Unicodes';

import {
    makeBidIO
} from '../socket/connect';

// TODO: remove setvalidbids from here
import {
    setBottomClient,
    setValidBids
} from '../redux/actions';

import {
    getName,
    getId,
    getValidBids,
    getTrumpValue,
    updateState
} from '../redux/selectors';


const CallBottomButtons = (props) => {
    const setBottom = () => {
        // for this client to call bottom
        const { id } = props;
        // TODO: only allow call bottom when the correct trump is in hand
        // FAKED HEARTS AS SUIT FOR NOW
        makeBidIO('H');
        props.setBottomClient(id);
    }

    // returns the array of buttons to be rendered
    // TODO: keep track of previous bids before rendering
    const getAvailableBidButtons = () => {
        const { validBids } = props;
        // validBids: [numOfCards, valueOfCards]
        // e.g. if I have 2 (2 of spades) -> [2, 'S'];
        // e.g. no trump: ['S', 'J'] or ['B', 'J']
        let bidArray = [];
        let hasNoTrump = false;
        validBids.forEach(bid => {
            if (bid[1] === 'J' && !hasNoTrump) { // have 2 jokers to call no trump
                bidArray.push(['No Trump', '']);
                hasNoTrump = true;
            } else {
                for (let i = 0; i < bid[0]; i++) {
                    bidArray.push([i + 1, bid[1]]);
                }
            }
        })
        return bidArray;
    }

    return (
        <>
            {
                getAvailableBidButtons().map((bidButton) => {
                    return (
                        <GameButton
                            label={bidButton[0]}
                            icon={Unicodes[bidButton[1]] || ''}
                            onClickCb={setBottom}
                        />
                    )
                })
            }
            {/* <GameButton
                label={'Bid'}
                icon={Unicodes.hearts}
                onClickCb={setBottom}
            />
            <GameButton
                label={'2'}
                onClickCb={setBottom}
            /> */}
        </>
    );
}

const mapStateToProps = (state) => {
    const name = getName(state);
    const id = getId(state);
    const validBids = getValidBids(state);
    const numUpdateStates = updateState(state);
    const trumpValue = getTrumpValue(state);
    return {
        id,
        name,
        validBids,
        trumpValue,
        numUpdateStates
    };
}

export default connect(mapStateToProps, {
    setBottomClient,
    setValidBids
})(CallBottomButtons);