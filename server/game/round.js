const Deck = require('./deck');
const sh = require('../sockets/socketUtils')

class Round {
    constructor(deck, players = null, trump_value) {
        this._deck = deck
        this._players = players
        this._declarer_points = 0
        this._opponent_points = 0
        this._trump_value = trump_value
        this._trump_suit = null
        this._bottom = null
        this._winner = null
    }

    deal() {
        for (let i = 0; i < 100; i++) {
            let card = this._deck.deal()
            sh.getSocket(this._players[i % 4]).emit('DealCard', [card.value, card.suit])
            interval = setInterval(() => {
                getCard(global.sockets[curuser]);
                curuser = 1 - curuser;
            }, 5);
        }
    }

    push_card(cards) {
        for (let i = 0; i < cards.length; i++)
        this._deck.push_card(cards[i])
    }

    get players() {
        return this._players
    }

    get declarer_points() {
        return this._declarer_points
    }

    set declarer_point(points) {
        this._declarer_points += points
    }

    get opponent_points() {
        return this._opponent_points
    }

    set opponent_point(points) {
        this._opponent_points += points
    }

    get trump_value() {
        return this._trump_value
    }

    get trump_suit() {
        return this._trump_suit
    }

    set trump_suit(suit) {
        this._trump_suit = suit
    }

    get bottom() {
        return this._bottom
    }

    set bottom(cards) {
        this._bottom = cards
    }

    winner() {
        self._winner = this._opponent_points >= 80 ? 'Opponents' : 'Declarers'
    }

}

module.exports = Round;
