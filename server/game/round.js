const constants = require('../constants')
const BidRound = require('./bidRound')
const PlayRound = require('./playRound')

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
        this._bids = {}
        for (let i = 0; i < this._players.length; i++) {
            this._bids[this._players[i]] = false
        }
    }

    dealAndBid() {
        constants.su.emitTrumpValue(this._trumpValue);
        this._bidRound = new BidRound(this._deck, this._players, this._trumpValue, this._roundNumber);
        this._bidRound.deal();
        for (let i = 0; i < this._players.length; i++) {
            constants.su.subSetBid(this._players[i], this._bidRound);
            constants.su.subDoneBid(this._players[i], this._bidRound);
        }



    }

    get deck() {
        return this._deck
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
