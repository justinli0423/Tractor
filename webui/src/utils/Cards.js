export default class Cards {
  suits = [];
  jokers = [];
  cards = [];
  // fake trump;
  trump = '2';

  constructor() {
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
    return `${arr[0]}${arr[1]}.svg`;
  }

  isTrump(card) {
    return card[0] === this.trump;
  }
};

function insertCard(cards, newCard, trumpValue, trumpSuit) {
  // want a black, red, black, red order
  // order already works for NT and spades trump
  let suitOrder = {'S': 0, 'D': 1, 'C': 2, 'H': 3};
  const valueOrder = {
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
  if (trumpSuit) {
    // diamonds are trump -> want diamonds first -> move spades to back
    if (trumpSuit === 'D') {
      suitOrder['S'] = 4;
      // clubs are trump -> switch clubs and spades
    } else if (trumpSuit === 'C') {
      suitOrder['C'] = 0;
      suitOrder['S'] = 2;
      // hearts are trump -> move hearts to front
    } else if (trumpSuit === 'H') {
      suitOrder['H'] = -1;
    }
  }
  if (cards) {
    let i = 0;
    // card is a joker
    if (newCard[0] === 'S' || newCard[1] === 'J') {
      while (i < cards.length && cards[i][0] === 'B' && cards[i][1] === 'J') {
        i++;
      }
      // card value is trump
    } else if (newCard[0] === trumpValue) {
      // Jokers come first
      while (i < cards.length && cards[i][1] === 'J') {
        i++;
      }
      // insert based on order
      while (i < cards.length && cards[i][0] === trumpValue && suitOrder[cards[i][1]] < suitOrder[newCard[1]]) {
        i++;
      }
      // card is neither a joker nor a "trump value trump"
    } else {
      while (i < cards.length && (cards[i][1] === 'J' || cards[i][0] === trumpValue)) {
        i++;
      }
      while (i < cards.length && suitOrder[cards[i][1]] < suitOrder[newCard[1]]) {
        i++;
      }
      while (i < cards.length && suitOrder[cards[i][1]] === suitOrder[newCard[1]] && valueOrder[cards[i][0]] < valueOrder[newCard[0]]) {
        i++;
      }
    }
    cards.splice(i, 0, newCard);
  } else {
    cards.push(newCard)
  }
}

function reSortCards(cards, trumpValue, newTrumpSuit) {
  let suitOrder;
  switch (newTrumpSuit) {
    case 'NT':
      suitOrder = ['J', 'STV', 'DTV', 'CTV', 'HTV', 'S', 'D', 'C', 'H'];
      break;
    case 'S':
      suitOrder = ['J', 'STV', 'DTV', 'CTV', 'HTV', 'S', 'D', 'C', 'H'];
      break;
    case 'D':
      suitOrder = ['J', 'DTV', 'CTV', 'HTV', 'STV', 'D', 'C', 'H', 'S'];
      break;
    case 'C':
      suitOrder = ['J', 'CTV', 'DTV', 'STV', 'HTV', 'C', 'D', 'S', 'H'];
      break;
    case 'H':
      suitOrder = ['J', 'HTV', 'STV', 'DTV', 'CTV', 'H', 'S', 'D', 'C'];
      break;
  }
  let memo = {'J':[], 'STV':[], 'DTV':[], 'CTV':[], 'HTV':[], 'S':[], 'D':[], 'C':[], 'H':[]}
  for (let i = 0; i < cards.length; i++) {
    if (cards[i][0] === trumpValue) {
      memo[cards[i][1] + 'TV'].push(cards[i])
    } else {
      memo[cards[i][1]].push(cards[i])
    }
  }
  let newCards = [];
  for (let i = 0; i < suitOrder.length; i++) {
    for (let j = 0; j < memo[suitOrder[i]].length; j++) {
      newCards.push(memo[suitOrder[i]][j])
    }
  }
  return newCards
}