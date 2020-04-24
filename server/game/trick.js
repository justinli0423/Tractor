const Card = require('./game/cards');

class Trick {
    constructor() {
        this._cards = [];
        this._winner = null;
        this._points = 0;
    }

    push_cards(cards) {
        this._cards.push(cards)
        return cards
    }

    end() {
        let ranks = []
        if (this._cards[0].length === 1) {
            const lead = this._cards[0][0].suit
            for (let i = 0; i < 4; i++) {
                ranks.push(this._cards[i][0].rank + (this._cards[i][0].suit === lead ? 13 : 0))
            }
        } else if (this._cards[0].length === 2 && this._cards[0][0] === this._cards[0][1]) {
            const lead = this._cards[0][0].suit
            for (let i = 0; i < 4; i++) {
                ranks.push(this._cards[i][0].rank + (this._cards[i][0].suit === lead ? 13 : 0))
            }
        }
    }

}