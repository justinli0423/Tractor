import _ from 'underscore';

export default class Cards {
  path = '';
  suits = [];
  jokers = [];
  cards = [];
  // want a black, red, black, red order
  suitOrder = { 'S': 0, 'D': 1, 'C': 2, 'H': 3 };
  // order already works for NT and spades trump
  valueOrder = {
    'A': 0,
    'K': 1,
    'Q': 2,
    'J': 3,
    '10': 4,
    '9': 5,
    '8': 6,
    '7': 7,
    '6': 8,
    '5': 9,
    '4': 10,
    '3': 11,
    '2': 12
  }

  constructor(path) {
    this.path = path;
    this.suits = new Set(['H', 'C', 'S', 'D']); //hearts, clubs, spades, diamonds
    this.jokers = new Set(['S', 'B']); // Small, big
    this.cards = new Set(['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']);
  }

  isValidCard(arr) {
    if (arr[1] === 'J') {
      // if it is a joker,
      return this.jokers.has(arr[0]);
    }

    let valid_card = this.cards.has(arr[0]);
    let valid_suit = this.suits.has(arr[1]);

    return valid_card && valid_suit;
  }

  getSvg(arr) {
    if (!this.isValidCard(arr)) {
      console.log(`Invalid card: ${arr}`);
    }
    return `${this.path}${arr[0]}${arr[1]}.svg`;
  }

  isTrump(card) {
    return card[0] === this.trump;
  }

  insertCard(cards, newCard, trumpValue, trumpSuit) {
    const cardObject = {
      card: newCard,
      isSelected: false,
      svg: this.getSvg(newCard)
    }
    if (trumpSuit) {
      // diamonds are trump -> want diamonds first -> move spades to back
      if (trumpSuit === 'D') {
        this.suitOrder['S'] = 4;
        // clubs are trump -> switch clubs and spades
      } else if (trumpSuit === 'C') {
        this.suitOrder['C'] = 0;
        this.suitOrder['S'] = 2;
        // hearts are trump -> move hearts to front
      } else if (trumpSuit === 'H') {
        this.suitOrder['H'] = -1;
      }
    }
    if (cards.length > 0) {
      let i = 0;
      // card is a joker
      if (newCard[0] === 'S' || newCard[1] === 'J') {
        while (i < cards.length && cards[i].card[0] === 'B' && cards[i].card[1] === 'J') {
          i++;
        }
        // card value is trump
      } else if (newCard[0] === trumpValue) {
        // Jokers come first
        while (i < cards.length && cards[i].card[1] === 'J') {
          i++;
        }
        // insert based on order
        while (i < cards.length && cards[i].card[0] === trumpValue && this.suitOrder[cards[i].card[1]] < this.suitOrder[newCard[1]]) {
          i++;
        }
        // card is neither a joker nor a "trump value trump"
      } else {
        while (i < cards.length && (cards[i].card[1] === 'J' || cards[i].card[0] === trumpValue)) {
          i++;
        }
        while (i < cards.length && this.suitOrder[cards[i].card[1]] < this.suitOrder[newCard[1]]) {
          i++;
        }
        while (i < cards.length && this.suitOrder[cards[i].card[1]] === this.suitOrder[newCard[1]] && this.valueOrder[cards[i].card[0]] < this.valueOrder[newCard[0]]) {
          i++;
        }
      }
      cards.splice(i, 0, cardObject);
    } else {
      cards.push(cardObject);
    }
  }
  
  // This is for after receiving trump
  // direction:
    // 1: increasing (3....A)
    // 0: decreasing (A....3)
  sortHand(cards, trumpValue, trumpSuit, direction = 0) {
    let diamonds = [];
    let clubs = [];
    let spades = [];
    let hearts = [];
    let jokers = [];
    let trumpD = [];
    let trumpS = [];
    let trumpH = [];
    let trumpC = [];

    let sortedCards = [];

    if (trumpSuit === 'S') {
      // if direction changed, sort otherway
      // otherwise nothing to do
      return;
    }

    // only get here if there is a trump suit change
    cards.forEach((cardObj) => {
      let cardVal = cardObj.card;
      if (cardVal[1] === 'J') {
        jokers.push(cardObj);
      }
      if (cardVal[0] === trumpValue) {
        if (cardVal[1] === 'S') {
          trumpS.push(cardObj);
        }
        if (cardVal[1] === 'C') {
          trumpC.push(cardObj);      
        }
        if (cardVal[1] === 'H') {
          trumpH.push(cardObj);
        }
        if (cardVal[1] === 'D') {
          trumpD.push(cardObj);
        }
      }
      else {
        if (cardVal[1] === 'S') {
          spades.push(cardObj);
        }
        if (cardVal[1] === 'C') {
          clubs.push(cardObj);      
        }
        if (cardVal[1] === 'H') {
          hearts.push(cardObj);
        }
        if (cardVal[1] === 'D') {
          diamonds.push(cardObj);
        }
      }
    });

    sortedCards.push(jokers);
    if (trumpValue === 'C') {
      sortedCards.push(trumpC, trumpH, trumpS, trumpD, clubs, hearts, spades, diamonds);
    }
    if (trumpValue === 'H') {
      sortedCards.push(trumpH, trumpS, trumpD, trumpC, hearts, spades, diamonds, clubs);
    }
    if (trumpValue === 'D') {
      sortedCards.push(trumpD, trumpC, trumpH, trumpS, diamonds, clubs, hearts, spades);
    }

    return sortedCards;
  }

  // TODO
  newTrump(trumpTracker, validBids, newCard, currentBid, trumpValue) {
    if (newCard[1] === 'J') {
      trumpTracker[newCard[0] + 'J'] += 1
      if (trumpTracker[newCard[0] + 'J'] === 2) {
        if (!currentBid || currentBid[1] !== 'J' || (currentBid[0] === 'S' && newCard[0] === 'B')) {
          validBids.push(newCard)
        }
      }
    } else if (newCard[0] === trumpValue) {
      trumpTracker[newCard[1]] += 1
      if (!currentBid || (currentBid[0] === 1 && trumpTracker[newCard[1]] === 2)) {
        validBids.push([trumpTracker[newCard[1]], newCard[1]])
      }
    }
  }

  updateBid(bid, trumpTracker, validBids) {
    validBids.splice(0, validBids.length)
    if (bid[0] === 1) {
      if (trumpTracker[bid[1]] === 2) {
        validBids.push([2, bid[1]])
      }
    }
  }

  receiveBid(bid, trumpTracker, validBids) {
    validBids.splice(0, validBids.length)
    
    if (_.isEqual(bid, ['B', 'J'])) {
      return;
    } 
    
    if (trumpTracker['BJ'] === 2) {
      validBids.push(['B', 'J'])
    }

    if (_.isEqual(bid, ['S', 'J'])) {
      return;
    }

    if (trumpTracker['SJ'] === 2) {
      validBids.push(['S', 'J'])
    }

    if (bid[0] === 2) {
      return;
    } 

    if (trumpTracker['S'] === 2) {
      validBids.push([2, 'S'])
    }
    
    if (trumpTracker['D'] === 2) {
      validBids.push([2, 'D'])
    }
    
    if (trumpTracker['C'] === 2) {
      validBids.push([2, 'C'])
    }
    
    if (trumpTracker['H'] === 2) {
      validBids.push([2, 'H'])
    }
  }
};
