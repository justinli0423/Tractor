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
        this._trickNumTractors = null;
        this._trickNumTractorCards = 0;
        this._trickNumSingles = 0;
        this._winner = null;
        this._points = 0;
    }

    play(i) {
        constants.su.emitNextClient(this._players[(this._starter + i) % constants.numPlayers], i);
    }

    isValid(socketId, play, other, i) {

        let valid = true;
        const trumpValue = this._trumpValue;
        const trumpSuit = this._trumpSuit;
        let playSuit = null;
        let playRank = 0;
        let playNumDoubles = 0;
        let playDoubles;
        let playNumTractors;
        let playNumTractorCards;
        let playTractors;
        let playLongestTractor;
        let playShortestTractor;
        let playNumSingles;
        let playSingles;
        let considerRank = true;
        let flag;
        let newOther;

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
        // console.log('trick.playDoubles', playDoubles);
        playNumDoubles = playDoubles.length;
        // console.log('trick.playNumDoubles', playNumDoubles)
        playTractors = this.getTractors(playDoubles, trumpValue, trumpSuit);
        // console.log('trick.playTractors', playTractors);
        playNumTractors = this.countTractors(playTractors);
        // console.log('trick.playNumTractors', playNumTractors);
        playNumTractorCards = _.reduce(_.mapObject(playNumTractors, (key, val) => {
            return key * val;
        }), (a, b) => {
            return a + b;
        })
        // console.log('trick.playNumTractorCards', playNumTractorCards);
        playLongestTractor = _.findLastIndex(playNumTractors, (i) => {
            return i > 0;
        })
        playShortestTractor = _.findIndex(playNumTractors, (i) => {
            return i > 0;
        })
        playSingles = this.getSingles(cards, playDoubles);
        // console.log('trick.playSingles', playSingles);
        playNumSingles = playSingles.length;
        // console.log('trick.playNumSingles', playNumSingles);


        if (this._trickSuit) {
            if (this._trickSuit === playSuit) {
                // console.log('trick.isValid - player played same suit');
                // console.log('trick.isValid - playNumDoubles', playNumDoubles);
                // console.log('trick.isValid - trickNumDoubles', this._trickNumDoubles);
                if (playNumDoubles < this._trickNumDoubles) {
                    if (this._hands[socketId].hasDouble(this._trickSuit, playNumDoubles + 1)) {
                        console.log('trick.isValid - Invalid - player has more doubles to play.');
                        valid = false;
                        flag = 'invalid'
                        newOther = other;
                    } else {
                        console.log('trick.isValid - Valid - player has no more doubles to play')
                        valid = true;
                    }
                    considerRank = false;
                } else {
                    if (!_.isEqual(this._trickNumTractors, playNumTractors)) {
                        // console.log(this._trickNumTractors, playNumTractors)
                        if (playNumTractorCards >= this._trickNumTractorCards) {
                            console.log('trick.isValid - Valid - Player played enough tractors.')
                            valid = true;
                            considerRank = true;
                        } else if (this._hands[socketId].hasTractor(this._trickSuit, playNumTractorCards)) {
                            console.log('trick.isValid - Invalid - Player has more tractors.')
                            valid = false;
                            considerRank = false;
                            flag = 'invalid'
                            newOther = other;
                        } else {
                            console.log('trick.isValid - Valid - Player has no more tractors.')
                            valid = true
                            considerRank = false;
                        }
                    } else {
                        valid = true;
                    }
                }
            } else if (playSuit === 'T') {
                console.log(`trick.isValid - played trump`)
                valid = !this._hands[socketId].hasSingle(this._trickSuit, 1);
                if (!valid) {
                    flag = 'invalid'
                    newOther = other;
                }
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
                if (!valid) {
                    flag = 'invalid'
                    newOther = other;
                }
                console.log(`trick.isValid - player has more than ${num} ${this._trickSuit}'s?`, valid)
            }
        } else {
            if (isSameSuit) {
                // if (false) {
                if (playNumSingles >= 2 || playNumSingles + playNumDoubles >= 2) {
                    if (playNumSingles > 0) {
                        const lowestSingle = playSingles[playSingles.length - 1]
                        for (let i = 0; i < constants.numPlayers; i++) {
                            if (this._players[i] === socketId) {
                                continue;
                            }
                            const hand = this._hands[this._players[i]];
                            if (hand.hasSingle(playSuit, 1)) {
                                const highestSingle = hand.highestSingle.call(hand, playSuit);
                                if (lowestSingle.getRank(trumpValue, trumpSuit) < highestSingle.getRank(trumpValue, trumpSuit)) {
                                    console.log(`trick.isValid - Invalid - cannot throw; ${constants.su.sockets[this._players[i]]} has a ${highestSingle}.`);
                                    valid = false;
                                    flag = 'badThrow';
                                    newOther = this.updateOther(play, other, lowestSingle);
                                }
                            }
                        }
                    }
                    if (playNumDoubles > 0) {
                        const lowestDouble = playDoubles[playDoubles.length - 1]
                        for (let i = 0; i < constants.numPlayers; i++) {
                            if (this._players[i] === socketId) {
                                continue;
                            }
                            const hand = this._hands[this._players[i]];
                            if (hand.hasDouble(playSuit, 1)) {
                                const highestDouble = hand.highestDouble.call(hand, playSuit);
                                if (lowestDouble.getRank(trumpValue, trumpSuit) < highestDouble.getRank(trumpValue, trumpSuit)) {
                                    console.log(`trick.isValid - Invalid - cannot throw; ${constants.su.sockets[this._players[i]]} has a ${highestSingle}.`);
                                    valid = false;
                                    flag = 'badThrow';
                                    newOther = this.updateOther(play, other, lowestDouble);
                                }
                            }
                        }
                    }
                    valid = valid && true;
                    if (valid) {
                        console.log('trick.isValid - player played a valid throw');
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
                this._trickNumTractorCards = playNumTractorCards;
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
                if (playTractors.length > 0) {
                    playRank = playTractors[0][0].getRank.call(playTractors[0][0], trumpValue, trumpSuit);
                } else if (this._trickNumDoubles > 0) {
                    playRank = playDoubles[0].getRank.call(playDoubles[0], trumpValue, trumpSuit);
                } else {
                    playRank = playSingles[0].getRank.call(playSingles[0], trumpValue, trumpSuit);
                }
            }

            console.log('The play', cards, `has rank ${playRank}.`)
            // console.log(`trickNumTractor; ${this._trickNumTractors}; trickNumDoubles: ${this._trickNumDoubles}; trickNumCards: ${this._trickNumCards}`)
            // console.log(`playNumTractor; ${playNumTractors}; playNumDoubles: ${playNumDoubles}; playNumCards: ${play.length}`)

            if (playRank > this._maxRank) {
                this._maxRank = playRank;
                this._winner = i;
            }

            flag = 'valid';
            newOther = other;

        } else {
            // console.log('trick.isValid - trick is invalid. players hand:', this._hands[socketId]);
        }
        return [valid, flag, newOther];
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
        return _.sortBy(tractors, (list) => {
            return -list.length;
        });
    }

    countTractors(tractors) {
        let tracker = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (let i = 0; i < tractors.length; i++) {
            tracker[tractors[i].length]++;
        }
        return tracker;
    }

    getSingles(cards, doubles) {
        let singles = [];
        for (let i = 0; i < cards.length; i++) {
            if (_.findIndex(doubles, (card) => {
                return cards[i].isEqual(card);
            }) === -1) {
                singles.push(cards[i])
            }
        }
        return singles;
    }

    updateOther(play, other, lowest) {
        console.log(other);
        return other;
    }

    get points() {
        return this._points;
    }

    get winner() {
        return this._winner;
    }


}

module.exports = Trick;