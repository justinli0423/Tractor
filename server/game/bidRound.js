const constants = require('../constants')

class BidRound {
    constructor(deck, players = null, trumpValue, roundNumber) {
        this._roundNumber = roundNumber
        this._deck = deck;
        this._players = players;
        this._trumpValue = trumpValue;
        this._trumpSuit = null;
        this._bidWinner = null;
        this._ready = 0
    }

    deal() {
        this._deck.shuffle();
        let i = 0;
        interval = setInterval(() => {
            let card = this._deck.deal();
            // TODO: CHANGE mod back to 4, i === 100
            // console.log(constants.su.sockets[this._players[i % 4]], [card.value, card.suit])
            constants.su.emitDealCard(this._players[i % 2], [card.value, card.suit]);
            i++;
            if (i === 24) {
                clearInterval(interval);
                console.log('bidRound:deal - Remaining cards:', this._deck.cards)
            }
        }, 20);
    }

    receiveBid(bid, socketId) {
        this._trumpSuit = bid[1] === 'J' ? 'NT' : bid[1];
        this._bidWinner = socketId;
        console.log('bidRound - Received bid', `bidWinner: ${constants.su._sockets[this._bidWinner]}, trumpSuit: ${this._trumpSuit}`)
    }

    doneBid() {
        this._ready += 1;
        if (this._ready === 4) {
            console.log('bidRound - Done bidding', `bidWinner: ${constants.su._sockets[this._bidWinner]}, trumpSuit: ${this._trumpSuit}`)
            console.log(`bidRound:doneBid - Remaining cards: ${this._deck}`)
            this.sendBottom();
        }
    }

    sendBottom() {
        let bottom = [];
        for (let i = 0; i < 4; i++) {
            let card = this._deck.deal()
            bottom.push([card.value, card.suit])
        }
        constants.su.emitBottom(this._bidWinner, bottom)
    }

    push_card(cards) {
        for (let i = 0; i < cards.length; i++)
            this._deck.push_card(cards[i]);
    }

    get players() {
        return this._players;
    }

    get trumpValue() {
        return this._trumpValue;
    }

    get trumpSuit() {
        return this._trumpSuit;
    }

    set trumpSuit(suit) {
        this._trumpSuit = suit;
    }

    get bottom() {
        return this._bottom;
    }

    set bottom(cards) {
        this._bottom = cards;
    }

}

module.exports = BidRound;
