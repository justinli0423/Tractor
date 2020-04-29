const _ = require('underscore');
const constants = require('../constants')
const BidRound = require('./bidRound')
git
class Round {
    constructor(deck, players = null, trumpValue, roundNumber) {
        this._roundNumber = roundNumber
        this._deck = deck;
        this._players = players;
        this._declarerPoints = 0;
        this._opponentPoints = 0;
        this._trumpValue = trumpValue;
        this._trumpSuit = null;
        this._bottom = null;
        this._winner = null;
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

    dealAndBid() {
        constants.su.emitTrumpValue(this._trumpValue);
        this._bidRound = new BidRound(this._deck, this._players, this._trumpValue, this._roundNumber);
        this._bidRound.deal();
        const bidRound = this._bidRound;
        _.map(this._players, function(socketId) {
            // constants.su.subSetBid(socketId, Round._bidRound.receiveBid.call(this).bind(this));
            // constants.su.subDoneBid(socketId, Round._bidRound.doneBid.call(this), Round.setTrumpAndOrder.call(this));
            constants.su.subSetBid(socketId, bidRound);
            // constants.su.subDoneBid(socketId, bidRound, this);
            constants.su.subDoneBid(socketId, bidRound);
        })
        this._trumpSuit = this._bidRound.trumpSuit;
        this._players = this._bidRound.players;
        console.log('round', this._trumpSuit)
    }

    setTrumpAndOrder() {
        this._trumpSuit = this._bidRound.trumpSuit;
        this._players = this._bidRound.players;
        console.log('round', this._trumpSuit)
    }

    get deck() {
        return this._deck;
    }

    get players() {
        return this._players;
    }

    get declarer_points() {
        return this._declarerPoints;
    }

    set declarer_point(points) {
        this._declarerPoints += points;
    }

    get opponent_points() {
        return this._opponentPoints;
    }

    set opponent_point(points) {
        this._opponentPoints += points;
    }

    get trump_value() {
        return this._trump_value;
    }

    get trump_suit() {
        return this._trump_suit;
    }

    set trump_suit(suit) {
        this._trump_suit = suit;
    }

    get bottom() {
        return this._bottom;
    }

    set bottom(cards) {
        this._bottom = cards;
    }

    winner() {
        self._winner = this._opponentPoints >= 80 ? 'Opponents' : 'Declarers';
    }

}

module.exports = Round;
