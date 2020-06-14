const _ = require('underscore');

class Hand {
    constructor(trumpValue) {
        this._numCards = 0;
        this._rawCards = [];
        this._trumpValue = trumpValue;
        this._trumpSuit = null;
        this._singles = {'S': [], 'D': [], 'C': [], 'H': [], 'T': []};
        this._doubles = {'S': [], 'D': [], 'C': [], 'H': [], 'T': []};
    }

    set trumpSuit(trumpSuit) {
        this._trumpSuit = trumpSuit;
    }

    pushCard(card) {
        this._numCards++;
        this._rawCards.push(card);
    }

    removeCard(card) {
        this._numCards--;
        let suit = (card.suit === 'J' || card.value === this._trumpValue || card.suit === this._trumpSuit) ? 'T' : card.suit;
        this._singles[suit].splice(_.findIndex(this._singles[suit], card.isEqual.bind(card)), 1);
        if (_.findIndex(this._doubles[suit], card.isEqual.bind(card)) > -1) {
            this._doubles[suit].splice(_.findIndex(this._doubles[suit], card.isEqual.bind(card)), 1);
        }
    }

    sortHand() {
        while (this._rawCards.length > 0) {
            let card = this._rawCards.pop();
            if (card.suit === 'J' || card.value === this._trumpValue || card.suit === this._trumpSuit) {
                if (_.findWhere(this._singles['T'], card)) {
                    this._doubles['T'].push(card);
                }
                this._singles['T'].push(card);
            } else {
                if (_.findWhere(this._singles[card.suit], card)) {
                    this._doubles[card.suit].push(card);
                }
                this._singles[card.suit].push(card);
            }
        }
        const suits = ['T', 'S', 'D', 'C', 'H']
        for (let i = 0; i < 5; i++) {
            this._doubles[suits[i]] = _.sortBy(this._doubles[suits[i]], (card) => {
                return card.getRank(this._trumpValue, this._trumpSuit);
            });
            this._singles[suits[i]] = _.sortBy(this._singles[suits[i]], (card) => {
                return card.getRank(this._trumpValue, this._trumpSuit);
            });
        }
    }

    get numCards() {
        return this._numCards;
    }

    hasSingle(suit, n) {
        return this._singles[suit].length >= n;
    }

    hasDouble(suit, n) {
        // console.log('hand.hasDouble - suit, n', suit, n)
        // console.log(this._doubles[suit].length)
        return this._doubles[suit].length >= n;
    }

    highestSingle(suit) {
        const trumpValue = this._trumpValue;
        const trumpSuit = this._trumpSuit;
        if (this._singles[suit].length > 0) {
            return _.max(this._singles[suit], (card) => {
                return card.getRank(trumpSuit, trumpValue)
            });
        } else {
            return null;
        }
    }

    highestDouble(suit) {
        const trumpValue = this._trumpValue;
        const trumpSuit = this._trumpSuit;
        if (this._doubles[suit].length > 0) {
            return _.max(this._doubles[suit], (card) => {
                return card.getRank(trumpSuit, trumpValue)
            });
        } else {
            return null;
        }
    }

    getTractors(suit) {

        const doubles = this._doubles[suit]
        const trumpValue = this._trumpValue;
        const trumpSuit = this._trumpSuit;

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
        for (let i = 0; i < tractors.length; i++) {
            tracker[tractors[i].length]++;
        }
        return tracker;
    }

    hasTractor(suit, playNumTractorCards) {
        const tractors = this.getTractors(suit);
        const numTractors = this.countTractors(tractors);
        return _.reduce(_.mapObject(numTractors, (key, val) => {
            return key * val;
        }), (a, b) => {
            return a + b;
        }) > playNumTractorCards;

    }

}

module.exports = Hand;
