const _ = require('underscore');
const constants = require('../constants')
const BidRound = require('./bidRound')
const PlayRound = require('./playRound')

class Round {
    constructor(deck, players = null, trumpValue, roundNumber) {
        this._roundNumber = roundNumber
        this._deck = deck;
        this._players = players;
        this._opponentPoints = 0;
        this._trumpValue = trumpValue;
        this._trumpSuit = null;
        this._bottom = null;
        this._bidRound = null;
        this._playRound = null;
        this._bids = {};
        for (let i = 0; i < this._players.length; i++) {
            this._bids[this._players[i]] = false
        }
    }

    get bidRound() {
        return this._bidRound;
    }

    set trumpSuit(trumpSuit) {
        this._trumpSuit = trumpSuit;
    }

    dealAndBid() {
        constants.su.emitTrumpValue(this._trumpValue);
        this._bidRound = new BidRound(this._deck, this._players, this._trumpValue, this._roundNumber);
        this._bidRound.deal();
        _.map(this._players, function(socketId) {
            constants.su.subSetBid(socketId);
            constants.su.subDoneBid(socketId);
        })
    }

    get playRound() {
        return this._playRound;
    }

    play() {
        this._trumpSuit = this._bidRound.trumpSuit;
        console.log(this._bidRound.bottom)
        this._playRound = new PlayRound(this._deck, this._players, this._bidRound.hands, this._trumpValue, this._trumpSuit, this._bidRound.bottom)
        this._playRound.nextTrick()
    }

    endRound() {
        this._opponentPoints = this._playRound.opponentPoints;
        this._deck = this._playRound.discard;
        constants.game.newRound();
    }

    get opponentPoints() {
        return this._opponentPoints;
    }

}

module.exports = Round;
