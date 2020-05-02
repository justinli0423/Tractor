const _ = require('underscore');
const constants = require('../constants');
const Card = require('./cards');

class Trick {
    constructor(players, hands, starter, trumpValue, trumpSuit) {
        console.log('New Trick');
        this._players = players;
        this._hands = hands;
        this._starter = starter;
        this._trumpValue = trumpValue;
        this._trumpSuit = trumpSuit;
        this._cards = {};
        this._maxRank = 0;
        this._trickSuit = null;
        this._trickNumCards = 0;
        this._winner = null;
        this._points = 0;
    }

    play(i) {
        if (i < constants.numPlayers) {
            constants.su.emitNextClient(this._players[(this._starter + i) % 4], i);
        } else {
            this.end();
        }
    }

    isValid(socketId, play, i) {
        console.log("checking if this shit is valid")
        console.log('what is this?', this)
        console.log('what is the trump value?', this._trumpValue)

        let valid;
        const trumpValue = this._trumpValue;
        const trumpSuit = this._trumpSuit;
        let playSuit = null;
        let playRank = 0;

        if (this._trickNumCards) {
            if (this._trickNumCards !== play.length) {
                return false
            }
        }

        const cards = _.map(play, (card) => {
            return new Card(card.value, card.suit);
        });

        const isAllTrump = _.filter(cards, (card) => {
            return card.suit === 'J' || card.value === trumpValue || card.suit === trumpSuit;
        }).length === cards.length;

        const isSameSuit = _.filter(cards, (card) => {
            return card.suit === cards[0].suit;
        }).length === cards.length || isAllTrump;

        if (isAllTrump) {
            playSuit = 'T';
        } else if (isSameSuit) {
            playSuit = cards[0].suit;
        }

        if (this._trickSuit) {

            if (this._trickSuit === playSuit) {
                valid = true;
            } else if (playSuit === 'T') {
                valid = !this._hands[socketId].hasSingle(this._trickSuit, 1);
            } else {
                const num = _.filter(cards, function (card) {
                    return card.suit === this._trickSuit;
                }).length
                valid = !this._hands[socketId].hasSingle(this._trickSuit, num + 1);
            }

        } else {
            if (isAllTrump) {
                valid = true;
                this._trickSuit = 'T';
                this._trickNumCards = cards.length;
            } else if (isSameSuit) {
                valid = true;
                this._trickSuit = cards[0].suit;
                this._trickNumCards = cards.length;
            } else {
                return false;
            }
        }

        if (valid) {
            this._cards[socketId] = cards;

            this._points += _.reduce(_.map(cards, function (card) {
                return card.getPoints();
            }), function (memo, num) {
                return memo + num
            }, 0);

            if (isSameSuit) {
                playRank = _.reduce(_.map(cards, function (card) {

                    return card.getRank.call(card, trumpValue, trumpSuit);
                }), function (memo, num) {
                    return memo + num
                }, 0);
            }

            if (playRank > this._maxRank) {
                this._maxRank = playRank;
                this._winner = i;
            }

        }
        return valid;
    }

    cardsPlayed() {
        let cards = {};
        _.each(Object.keys(this._cards), (player) => {
            cards[player] = _.map(this._cards[player], (card) => {
                return [card.value, card.suit];
            })
        })
        return cards;
    }
    
    pushCard(card) {
        this._cards.push(card)
    }

    end() {

    }

    get winner() {
        return this._winner;
    }


}

module.exports = Trick;