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
        constants.su.emitNextClient(this._players[(this._starter + i) % constants.numPlayers], i);
    }

    isValid(socketId, play, i) {
        // console.log(typeof this)
        // console.log(this)
        let valid;
        const trumpValue = this._trumpValue;
        const trumpSuit = this._trumpSuit;
        let playSuit = null;
        let playRank = 0;
        // console.log('the trump value of this trick is :', trumpValue)
        // console.log('the trump suit of this trick is:', trumpSuit)

        if (this._trickNumCards) {
            if (this._trickNumCards !== play.length) {
                return false
            }
        }

        const cards = _.map(play, (card) => {
            return new Card(card[0], card[1]);
        });

        // console.log('trick:isvalid:cards', cards)

        const isAllTrump = _.filter(cards, (card) => {
            return card.suit === 'J' || card.value === trumpValue || card.suit === trumpSuit;
        }).length === cards.length;

        const isSameSuit = _.filter(cards, (card) => {
            return card.suit === cards[0].suit;
        }).length === cards.length || isAllTrump;

        // console.log('the cards are all trump:', isAllTrump)
        // console.log('the cards are the same suit:', isSameSuit)

        if (isAllTrump) {
            playSuit = 'T';
        } else if (isSameSuit) {
            playSuit = cards[0].suit;
        }

        // console.log('The play suit is:', playSuit)

        if (this._trickSuit) {

            // console.log('trick:isValid - Went in code block with this._trickSuit', this._trickSuit)

            if (this._trickSuit === playSuit) {
                valid = true;
            } else if (playSuit === 'T') {
                valid = !this._hands[socketId].hasSingle(this._trickSuit, 1);
            } else {
                const sameSuit = (card) => {
                    return card.suit === this._trickSuit;
                }
                const num = _.filter(cards, sameSuit.bind(this)).length
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

            // console.log('trick:isvalid - Hand before removing cards', this._hands[socketId])
            _.forEach(cards, (card) => {
                this._hands[socketId].removeCard(card);
            })
            // console.log('trick:isvalid - Hand after removing cards', this._hands[socketId])

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
                console.log('The play', cards, `has rank ${playRank}.`)
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

    get points() {
        return this._points;
    }

    get winner() {
        return this._winner;
    }


}

module.exports = Trick;