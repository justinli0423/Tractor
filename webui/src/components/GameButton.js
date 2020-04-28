import React from 'react';
import styled from 'styled-components';


const GameFunction = (props) => {
  return(
    <Button
      onClick={() => props.onClickCb(props.bid)}
    >
      {props.label}
      <Icon
        color={props.color}
        dangerouslySetInnerHTML={{__html: props.icon}}
      >
      </Icon>
    </Button>
  );
}

// TODO: FIX BUTTON ALIGNMENT AND SIZE
const Button = styled.button`
  display: block;
  padding: 10px;
  margin: 5px;
  height: 55px;
  width: 130px;
`;

const Icon = styled.span`
  padding-left: 5px;
  font-size: 20px;
  color: red;
  filter: ${props => props.color === 'black' && 'grayscale(1)'};
`;

export default GameFunction;