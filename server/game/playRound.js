const _ = require('underscore');
const constants = require('../constants');
const Trick = require('./trick');

class PlayRound {
    constructor(deck, players, hands, trumpValue, trumpSuit, bottom) {
        this._discard = deck;
        this._players = players;
        this._hands = hands;
        this._opponentPoints = 0;
        this._trumpValue = trumpValue;
        this._trumpSuit = trumpSuit;
        this._bottom = bottom;
        this._trick = null;
        this._trickStarter = 0;
    }

    nextTrick() {
        if (this._trick) {
            this._trickStarter = (this._trickStarter + this._trick.winner) % constants.numPlayers;
            if (this._trickStarter % 2 !== 0) {
                this._opponentPoints += this._trick.points;
            }
            let discard = Object.values(this._trick._cards).flat();
            _.forEach(discard, (card) => {
                this._discard.pushCard(card);
            })
            console.log('Trick won by', constants.su._sockets[this._players[this._trickStarter]]);
            console.log('Opponent points:', this._opponentPoints)
            constants.su.emitOpponentPoints(this._opponentPoints);
        }

        if (this._hands[this._players[0]].numCards > 0) {
            this._trick = new Trick(this._players, this._hands, this._trickStarter, this._trumpValue, this._trumpSuit);
            this._trick.play(0);
        } else {
            let bottomPoints = 0;
            for (let i = 0; i < constants.numBottom; i++) {
                const card = this._bottom.deal()
                bottomPoints += card.getPoints();
                this._discard.pushCard(card)
            }
            if (this._trickStarter % 2 !== 0) {
                this._opponentPoints += bottomPoints;
            }
            console.log('Opponent points:', this._opponentPoints)
            constants.game.round.endRound();
        }
    }

    get trick() {
        return this._trick;
    }

    get discard() {
        console.log('discard numcards', this._discard.numCards);
        return this._discard;
    }

    pushCard(cards) {
        for (let i = 0; i < cards.length; i++)
            this._discard.pushCard(cards[i]);
    }

    get opponentPoints() {
        return this._opponentPoints;
    }

    get trumpValue() {
        return this._trumpValue;
    }

    get trumpSuit() {
        return this._trumpSuit;
    }

    get bottom() {
        return this._bottom;
    }

    set bottom(cards) {
        this._bottom = cards;
    }

}

module.exports = PlayRound;
