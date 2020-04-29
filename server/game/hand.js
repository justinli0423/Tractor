const _ = require('underscore');

class Hand {
    constructor(trumpValue, trumpSuit) {
        this._rawCards = []
        this._trumpValue = trumpValue;
        this._trumpSuit = trumpSuit;
        this._singles = {'S': [], 'D': [], 'C': [], 'H': [], 'T': []};
        this._doubles = {'S': [], 'D': [], 'C': [], 'H': [], 'T': []};
    }

    pushCard(card) {
        this._rawCards.push(card)
    }
    
    sortHand() {
        for (let i = 0; i < this._rawCards.length; i++) {
            let card = this._rawCards[i]
            if (card.suit === 'J' || card.value === this._trumpValue || card.suit === this._trumpSuit) {
                if (_.contains(this._singles['T'], card)) {
                    this._doubles['T'].push(card);
                }
                this._singles['T'].push(card);
            } else {
                if (_.contains(this._singles[card.suit], card)) {
                    this._doubles[card.suit].push(card);
                }
                this._singles[card.suit].push(card);
            }
        }
    }


    push_card(card) {
        this._cards.push(card);
    }

    deal() {
        return this._cards.pop();
    }
}

module.exports = Hand;
