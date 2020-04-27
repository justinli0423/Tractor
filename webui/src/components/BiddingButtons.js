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
        <GameButton
            label = {'Bid'}
            onClickCb = {setBottom}
        />
        <GameButton
            label = {'2'}
            onClickCb = {setBottom}
        />
    );
}

const mapStateToProps = (state) => {
    const name = getName(state);
    const numUpdateStates = updateState(state);
    const id = getId(state);

    return {
        id,
        name,
        numUpdateStates
    };
}

export default connect(mapStateToProps, {
    setBottomClient
})(CallBottomButtons);