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
        this._trickNumDoubles = 0;
        this._winner = null;
        this._points = 0;
    }

    play(i) {
        constants.su.emitNextClient(this._players[(this._starter + i) % constants.numPlayers], i);
    }

    isValid(socketId, play, i) {

        let valid;
        const trumpValue = this._trumpValue;
        const trumpSuit = this._trumpSuit;
        let playSuit = null;
        let playRank = 0;
        let playNumDoubles = 0;
        let considerRank = true;


        if (this._trickNumCards) {
            if (this._trickNumCards !== play.length) {
                return false
            }
        }

        const cards = _.map(play, (card) => {
            return new Card(card[0], card[1])
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

        playNumDoubles = this.countDoubles(cards);

        if (this._trickSuit) {
            if (this._trickSuit === playSuit) {
                console.log('trick:isValid - playNumDoubles', playNumDoubles);
                console.log('trick:isValid - trickNumDoubles', this._trickNumDoubles);
                if (playNumDoubles !== this._trickNumDoubles) {
                    console.log(this._hands[socketId]);
                    console.log('trick:isValid - player has less than trickNumDoubles', this._hands[socketId].hasDouble(this._trickSuit, this._trickNumDoubles));
                    if (this._hands[socketId].hasDouble(this._trickSuit, this._trickNumDoubles)) {
                        valid = false;
                        console.log('trick.isValid - valid1', valid)
                        considerRank = false;
                        console.log('trick.isValid - considerRank1', considerRank)
                    } else {
                        valid = true;
                    }
                } else {
                    valid = true;
                }
            } else if (playSuit === 'T') {
                valid = !this._hands[socketId].hasSingle(this._trickSuit, 1);
                if (valid && playNumDoubles !== this._trickNumDoubles) {
                    considerRank = false;
                }
            } else {
                considerRank = false;
                const sameSuit = (card) => {
                    return card.suit === this._trickSuit;
                }
                const num = _.filter(cards, sameSuit.bind(this)).length
                valid = !this._hands[socketId].hasSingle(this._trickSuit, num + 1);
            }

        } else {
            console.log(`${constants.su.sockets[socketId]} started the trick.`)
            if (isSameSuit) {
                valid = true;
                this._trickSuit = playSuit;
                this._trickNumCards = cards.length;
                this._trickNumDoubles = playNumDoubles;
            } else {
                return false;
            }
        }

        if (valid) {
            this._cards[socketId] = cards;

            _.forEach(cards, (card) => {
                this._hands[socketId].removeCard(card);
            })

            this._points += _.reduce(_.map(cards, function (card) {
                return card.getPoints();
            }), function (memo, num) {
                return memo + num
            }, 0);

            console.log('trick.isValid - considerRank2', considerRank)

            if (considerRank) {
                playRank = _.reduce(_.map(cards, function (card) {
                    return card.getRank.call(card, trumpValue, trumpSuit);
                }), function (memo, num) {
                    return memo + num
                }, 0);
            }
            console.log('The play', cards, `has rank ${playRank}.`)

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

    countDoubles(cards) {
        let count = 0;
        for (let i = 0; i < cards.length - 1; i++) {
            count += cards[i].isEqual(cards[i + 1]) ? 1 : 0;
        }
        return count;
    }


    get points() {
        return this._points;
    }

    get winner() {
        return this._winner;
    }


}

module.exports = Trick;