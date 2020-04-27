const Deck = require('./deck');
const constants = require('../constants')

class Round {
    constructor(deck, players = null, trump_value) {
        this._deck = deck;
        this._players = players;
        this._declarer_points = 0;
        this._opponent_points = 0;
        this._trump_value = trump_value;
        this._trump_suit = null;
        this._bottom = null;
        this._winner = null;
    }

    startRound() {
        this._deck.shuffle();
        constants.su.emitTrumpValue(this._trump_value);
        this.deal();
        this._players.forEach(constants.su.subSetBid.bind(constants.su));
    }

    get deck() {
        return this._deck
    }

    deal() {
        let i = 0
        interval = setInterval(() => {
            let card = this._deck.deal();
            // TODO: CHANGE mod back to 4, i === 100
            // console.log(constants.su.sockets[this._players[i % 4]], [card.value, card.suit])
            constants.su.emitDealCard(this._players[i % 1], [card.value, card.suit]);
            i++;
            if (i === 25) {
                clearInterval(interval);
            }
        }, 20);
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

module.exports = Round;
