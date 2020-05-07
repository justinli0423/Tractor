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
        console.log('deck.hasDouble - suit, n', suit, n)
        console.log(this._doubles[suit].length)
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

    highestTractor(suit, length) {

    }

}

module.exports = Hand;
