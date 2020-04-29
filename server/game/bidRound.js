const _ = require('underscore');
const constants = require('../constants');
const Hand = require('./hand');
const Deck = require('./deck');
const Card = require('./cards');

class BidRound {
    constructor(deck, players, trumpValue, trumpSuit, roundNumber) {
        this._roundNumber = roundNumber;
        this._deck = deck;
        this._players = players;
        this._hands = {};
        for (let i = 0; i < this._players.length; i ++) {
            this._hands[this._players[i]] = new Hand(this._trumpValue, this._trumpSuit);
        }
        this._trumpValue = trumpValue;
        this._trumpSuit = trumpSuit;
        this._bidWinner = null;
        this._bottom = new Deck();
        this._ready = 0;
    }

    get deck() {
        return this._deck;
    }

    deal() {
        console.log("original player order", this._players);
        this._deck.shuffle();
        let i = 0;
        constants.interval = setInterval(() => {
            let card = this._deck.deal();
            // TODO: CHANGE mod back to 4, i === 100
            constants.su.emitDealCard(this._players[i % constants.numPlayers], [card.value, card.suit]);
            this._hands[this._players[i % constants.numPlayers]].pushCard(card);
            i++;
            if (i === 24) {
                clearInterval(constants.interval);
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
            if (this._roundNumber === 0) {
                this.rotatePlayers();
            }
        }
    }

    sendBottom() {
        console.log(this._hands);
        this.sortHands();
        console.log(this._hands);
        let bottom = [];
        for (let i = 0; i < 4; i++) {
            let card = this._deck.deal();
            bottom.push([card.value, card.suit]);
        }
        let declarer = this._roundNumber === 0 ? this._bidWinner : this._players[0];
        constants.su.emitBottom(declarer, bottom);
        console.log('sendBottom', declarer);
        constants.su.subNewBottom(declarer, this);
    }

    rotatePlayers() {
        const i = _.indexOf(this._players, this._bidWinner);
        let temp = [];
        for (let j = 0; j < this._players.length; j++) {
            temp[j] = this._players[(j + i) % this._players.length];
        }
        for (let j = 0; j < this._players.length; j++) {
            this._players[j] = temp[j];
        }
        console.log('Rotated Player Order', this._players);
    }

    set bottom(cards) {
        for (let i = 0; i < cards.length; i++) {
            this._bottom.push_card(new Card(cards[i][0], cards[i][1], this._trumpValue, this._trumpSuit));
        }
        console.log('bidRound:setBottom - Bottom sent by declarer:', this._bottom)
    }

    get bottom() {
        return this._bottom;
    }

    sortHands() {
        for (let i = 0; i < this._players.length; i ++) {
            this._hands[this._players[i]].sortHand();
        }
    }

}

module.exports = BidRound;
