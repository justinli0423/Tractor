import React, { useState, useEffect } from "react";
// import styled from 'styled-components';
import { Card } from '../utils/getCards';

const path = '../cardsSvg/';

function Game() {
  const Cards = new Card();

  const [myCards, setCards] = useState([] as any);

  // useEffect(() => {
  //   const tmpCards : any[][] = [[1, 'S'], [3, 'C'], [5, 'D'], ['K', 'S']];
  //   const cardSvgs: string[] = [];
  //   tmpCards.forEach((card) => {
  //     console.log(Cards.getSvg(card));
  //     cardSvgs.push(Cards.getSvg(card));
  //   });
  //   setCards(cardSvgs);
  // }, []);

  return(
    <div>Hello</div>
  )
}

export default Game;