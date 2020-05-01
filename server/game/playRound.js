const constants = require('../constants')

class PlayRound {
    constructor(deck, players = null, trumpValue, trumpSuit, bottom) {
        this._deck = deck;
        this._players = players;
        this._declarer_points = 0;
        this._opponent_points = 0;
        this._trumpValue = trumpValue;
        this._trumpSuit = trumpSuit;
        this._bottom = null;
        this._winner = null;
    }

    get deck() {
        return this._deck
    }

    push_card(cards) {
        for (let i = 0; i < cards.length; i++)
            this._deck.push_card(cards[i]);
    }

    get players() {
        return this._players;
    }

    get declarer_points() {
        return this._declarer_points;
    }

    set declarer_point(points) {
        this._declarer_points += points;
    }

    get opponent_points() {
        return this._opponent_points;
    }

    set opponent_point(points) {
        this._opponent_points += points;
    }

    get trump_value() {
        return this._trump_value;
    }

    get trump_suit() {
        return this._trump_suit;
    }

    set trump_suit(suit) {
        this._trump_suit = suit;
    }

    get bottom() {
        return this._bottom;
    }

    set bottom(cards) {
        this._bottom = cards;
    }

    winner() {
        self._winner = this._opponent_points >= 80 ? 'Opponents' : 'Declarers';
    }

}

module.exports = PlayRound;
