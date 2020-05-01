const constants = require('../constants')
const Card = require('./cards');

class BidRound {
    constructor(deck, players = null, trumpValue, roundNumber) {
        this._roundNumber = roundNumber;
        this._deck = deck;
        this._players = players;
        this._trumpValue = trumpValue;
        this._trumpSuit = null;
        this._bidWinner = null;
        this._ready = 0;
    }

    get deck() {
        return this._deck;
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
            }
        }, 20);
    }

    receiveBid(bid, socketId) {
        this._trumpSuit = bid[1] === 'J' ? 'NT' : bid[1];
        this._bidWinner = socketId;
        console.log('bidRound:receiveBid - Received bid', `bidder: ${constants.su._sockets[this._bidWinner]}, trumpSuit: ${this._trumpSuit}`);
    }

    doneBid() {
        this._ready += 1;
        if (this._ready === this._players.length) {
            console.log('bidRound:doneBid - Done bidding', `bidWinner: ${constants.su._sockets[this._bidWinner]}, trumpSuit: ${this._trumpSuit}`);
            console.log('bidRound:doneBid - Bottom cards:', this._deck);
            this.sendBottom();
        }
    }

    sendBottom() {
        let bottom = [];
        for (let i = 0; i < 4; i++) {
            let card = this._deck.deal();
            bottom.push([card.value, card.suit]);
        }
        let declarer = this._roundNumber === 0 ? this._bidWinner : this._players[0];
        constants.su.emitBottom(declarer, bottom);
        constants.su.subNewBottom(declarer, this);
    }

    setBottom(cards) {
        for (let i = 0; i < cards.length; i++) {
            this._deck.push_card(new Card(cards[i][0], cards[i][1], this._trumpValue, this._trumpSuit));
        }
    }

    get players() {
        return this._players;
    }

    get trumpSuit() {
        return this._trumpSuit;
    }

}

module.exports = BidRound;
