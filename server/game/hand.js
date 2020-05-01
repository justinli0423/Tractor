const _ = require('underscore');

class Hand {
    constructor(trumpValue, trumpSuit) {
        this._numCards = 0;
        this._rawCards = [];
        this._trumpValue = trumpValue;
        this._trumpSuit = trumpSuit;
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
        this._singles[suit].splice(_.findIndex(this._singles[suit], card.isEqual), 1);
        if (_.findIndex(this._doubles[suit], card.isEqual) > -1) {
            this._doubles[suit].splice(_.findIndex(this._doubles[suit], card.isEqual), 1);
        }
    }

    sortHand(trumpSuit) {
        this._trumpSuit = trumpSuit;
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
    }

    hasSingle(suit, n = 1) {
        return this._singles[suit].length >= n;
    }

    hasDouble(suit, n = 1) {
        return this._doubles[suit].length >= n;
    }


    highestSingle(suit) {
        const trumpValue = this._trumpValue;
        const trumpSuit = this._trumpSuit;
        return _.max(this._singles[suit], function (card) {
            return card.getRank(trumpSuit, trumpValue)
        });
    }

    highestDouble(suit) {
        const trumpValue = this._trumpValue;
        const trumpSuit = this._trumpSuit;
        return _.max(this._doubles[suit], function (card) {
            return card.getRank(trumpSuit, trumpValue)
        });
    }

    highestTractor(suit, length) {

    }

}

module.exports = Hand;
