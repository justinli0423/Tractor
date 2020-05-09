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
        this._trickNumTractors = {};
        this._trickNumSingles = 0;
        this._winner = null;
        this._points = 0;
    }

    play(i) {
        constants.su.emitNextClient(this._players[(this._starter + i) % constants.numPlayers], i);
    }

    isValid(socketId, play, i) {

        let valid = true;
        const trumpValue = this._trumpValue;
        const trumpSuit = this._trumpSuit;
        let playSuit = null;
        let playRank = 0;
        let playNumDoubles = 0;
        let playDoubles;
        let playNumTractors;
        let playTractors;
        let playNumSingles;
        let playSingles;
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

        playDoubles = this.getDoubles(cards);
        playNumDoubles = playDoubles.length;
        playTractors = this.getTractors(playDoubles, trumpValue, trumpSuit);
        playNumTractors = this.countTractors(playTractors);
        playSingles = this.getSingles(cards, playDoubles);
        playNumSingles = playSingles.length;


        if (this._trickSuit) {
            if (this._trickSuit === playSuit) {
                console.log('trick.isValid - player played same suit');
                console.log('trick.isValid - playNumDoubles', playNumDoubles);
                console.log('trick.isValid - trickNumDoubles', this._trickNumDoubles);
                if (playNumDoubles < this._trickNumDoubles) {
                    if (this._hands[socketId].hasDouble(this._trickSuit, playNumDoubles + 1)) {
                        console.log('trick.isValid - player has more doubles to play', this._hands[socketId].hasDouble(this._trickSuit, this._trickNumDoubles));
                        valid = false;
                    } else {
                        console.log('trick.isValid - player has no more doubles to play')
                        valid = true;
                    }
                    considerRank = false;
                } else {
                    if (!_.isEqual(this._trickNumTractors, playNumTractors)) {
                        // has more tractors
                        if (false) {
                            console.log('trick.isValid - Player has more tractors.')
                            valid = true;
                        } else {
                            console.log('trick.isValid - Player has no more tractors.')
                            valid = true
                        }
                        considerRank = false;
                    } else {
                        valid = true;
                    }
                }
            } else if (playSuit === 'T') {
                console.log(`trick.isValid - played trump`)
                valid = !this._hands[socketId].hasSingle(this._trickSuit, 1);
                console.log(`trick.isValid - player has no more ${this._trickSuit}'s?`, valid)
                if (valid && playNumDoubles !== this._trickNumDoubles) {
                    considerRank = false;
                }
            } else {
                considerRank = false;
                const sameSuit = (card) => {
                    if (this._trickSuit !== 'T') {
                        return card.suit === this._trickSuit;
                    } else {
                        return card.suit === 'J' || card.value === trumpValue || card.suit === trumpSuit;
                    }
                }
                const num = _.filter(cards, sameSuit.bind(this)).length
                console.log(`trick.isValid - played ${num} ${this._trickSuit}'s`)
                valid = !this._hands[socketId].hasSingle(this._trickSuit, num + 1);
                console.log(`trick.isValid - player has more than ${num} ${this._trickSuit}'s?`, valid)
            }

        } else {
            if (isSameSuit) {
                if (playNumSingles >= 2 || playNumSingles + playNumDoubles >= 2) {
                    if (playNumSingles > 0) {
                        const lowestSingle = playSingles[playSingles.length - 1]
                        for (let i = 0; i < constants.numPlayers; i++) {
                            const hand = this._hands[this._players[i]];
                            const highestSingle = hand.highestSingle.call(hand, playSuit);
                            if (hand.hasSingle(playSuit, 1)) {
                                if (lowestSingle.getRank(trumpValue, trumpSuit) < highestSingle.getRank(trumpValue, trumpSuit)) {
                                    valid = false;
                                }
                            }
                        }
                    }
                    if (playNumDoubles > 0) {
                        const lowestDouble = playDoubles[playDoubles.length - 1]
                        for (let i = 0; i < constants.numPlayers; i++) {
                            const hand = this._hands[this._players[i]];
                            const highestDouble = hand.highestDouble.call(hand, playSuit);
                            if (hand.hasDouble(playSuit, 1)) {
                                if (lowestDouble.getRank(trumpValue, trumpSuit) < highestDouble.getRank(trumpValue, trumpSuit)) {
                                    valid = false;
                                }
                            }
                        }
                    }
                    valid = valid && true;
                    if (valid) {
                        console.log('trick.isValid - player played a valid throw');
                    } else {
                        console.log('trick.isValid - player played an invalid throw');
                    }
                }
            } else {
                return false;
            }
            if (valid) {
                this._trickSuit = playSuit;
                this._trickNumCards = cards.length;
                this._trickNumDoubles = playNumDoubles;
                this._trickNumTractors = playNumTractors;
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

            if (considerRank) {
                // playRank = _.reduce(_.map(cards, function (card) {
                //     return card.getRank.call(card, trumpValue, trumpSuit);
                // }), function (memo, num) {
                //     return memo + num
                // }, 0);
                if (this._trickNumTractors.length > 0) {
                    playRank = playDoubles[0].getRank.call(playDoubles[0], trumpValue, trumpSuit);
                } else if (this._trickNumDoubles > 0) {
                    playRank = playDoubles[0].getRank.call(playDoubles[0], trumpValue, trumpSuit);
                } else {
                    playRank = playSingles[0].getRank.call(playSingles[0], trumpValue, trumpSuit);
                }
            }

            console.log('The play', cards, `has rank ${playRank}.`)
            console.log(`trickNumTractor; ${this._trickNumTractors}; trickNumDoubles: ${this._trickNumDoubles}; trickNumCards: ${this._trickNumCards}`)
            console.log(`playNumTractor; ${playNumTractors}; playNumDoubles: ${playNumDoubles}; playNumCards: ${play.length}`)

            if (playRank > this._maxRank) {
                this._maxRank = playRank;
                this._winner = i;
            }

        } else {
            console.log('trick.isValid - trick is invalid. players hand:', this._hands[socketId]);
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

    getDoubles(cards) {
        let doubles = [];
        let i = 0;
        while (i < cards.length - 1) {
            if (cards[i].isEqual(cards[i + 1])) {
                doubles.push(cards[i]);
                i += 2;
            } else {
                i++;
            }
        }
        return doubles;
    }

    getTractors(doubles, trumpValue, trumpSuit) {
        let order = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
        order.splice(_.indexOf(order, trumpValue), 1);

        let tractors = [];

        if (doubles.length < 2) {
            return tractors;
        }

        let currTractor = [doubles[0]];
        let i = 1;

        while (i < doubles.length) {
            // big joker
            if (currTractor[currTractor.length - 1].value === 'B') {
                if (doubles[i].value === 'S') {
                    currTractor.push(doubles[i])
                } else {
                    if (currTractor.length >= 2) {
                        tractors.push(currTractor);
                    }
                    currTractor = [doubles[i]];
                }
                i++;
                // small joker
            } else if (currTractor[currTractor.length - 1].value === 'S') {
                if (doubles[i].value === trumpValue && doubles[i].suit === trumpSuit) {
                    currTractor.push(doubles[i])
                } else {
                    if (currTractor.length >= 2) {
                        tractors.push(currTractor);
                    }
                    currTractor = [doubles[i]];
                }
                i++;
                // big trumpValue
            } else if (currTractor[currTractor.length - 1].value === trumpValue && currTractor[currTractor.length - 1].suit === trumpSuit) {
                if (doubles[i].value === trumpValue) {
                    currTractor.push(doubles[i])
                } else {
                    if (currTractor.length >= 2) {
                        tractors.push(currTractor);
                    }
                    currTractor = [doubles[i]];
                }
                i++;
                // small trumpValue
            } else if (currTractor[currTractor.length - 1].value === trumpValue) {
                if (doubles[i].value === order[order.length - 1]) {
                    currTractor.push(doubles[i])
                } else if (doubles[i].value !== trumpValue) {
                    if (currTractor.length >= 2) {
                        tractors.push(currTractor);
                    }
                    currTractor = [doubles[i]];
                }
                i++;
                // everything else, including non trump
            } else {
                const j = _.indexOf(order, currTractor[currTractor.length - 1].value)
                if (doubles[i].value === order[j - 1]) {
                    currTractor.push(doubles[i])
                } else {
                    if (currTractor.length >= 2) {
                        tractors.push(currTractor);
                    }
                    currTractor = [doubles[i]];
                }
                i++;
            }
        }
        if (currTractor.length >= 2) {
            tractors.push(currTractor);
        }
        return tractors;
    }

    countTractors(tractors) {
        let tracker = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        let numTractors = [];
        for (let i = 0; i < tractors.length; i++) {
            // if (numTractors[tractors[i].length]) {
            //     numTractors[tractors[i].length]++;
            // } else {
            //     numTractors[tractors[i].length] = 1
            // }
            tracker[tractors[i].length]++;
        }
        for (let i = 0; i < numTractors.length; i++) {
            numTractors.push([tracker[i], i])
        }
        return numTractors
    }

    getSingles(cards, doubles) {
        let singles = [];
        for (let i = 0; i < cards.length; i++) {
            if (_.indexOf(doubles, cards[i]) === -1) {
                singles.push(cards[i])
            }
        }
        return singles;
    }

    get points() {
        return this._points;
    }

    get winner() {
        return this._winner;
    }


}

module.exports = Trick;