const _ = require('underscore');
const constants = require('../constants')
const BidRound = require('./bidRound')
const PlayRound = require('./playRound')

class Round {
    constructor(room, deck, players = null, trumpValue, roundNumber) {
        this._room = room;
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
        constants.su.emitTrumpValue(this._room, this._trumpValue);
        // console.log('round:dealAndBid - typeof deck', typeof this._deck)
        // console.log('round:dealAndBid - round', this)
        // console.log('round:dealAndBid - deck numcards', this._deck.numCards)
        this._bidRound = new BidRound(this._room, this._deck, this._players, this._trumpValue, this._roundNumber);
        this._bidRound.deal.call(this._bidRound);
        _.map(this._players, function (socketId) {
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
        console.log('round.endRound - opponentPoints', this._opponentPoints, this._playRound.opponentPoints)
        console.log('round.endRound - this._deck before discard', this._deck.numCards, this._playRound.discard.numCards)
        constants.games[this._room]._deck = this._playRound.discard;
        console.log('round.endRound - this._deck after discard', this._deck.numCards, this._playRound.discard.numCards)
        constants.games[this._room].newRound();
    }

    get opponentPoints() {
        return this._opponentPoints;
    }

}

module.exports = Round;
