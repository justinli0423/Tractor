import React from 'react';
import styled from 'styled-components';

const GameFunction = (props) => {
  return(
    <Button
      id={props.id}
      onClick={() => props.onClickCb && props.onClickCb()}
    >
      {props.label}
    </Button>
  );
}


// TODO: ensure common button sizing across all buttons (not just auto)
export const Button = styled.button`
  display: inline-block;
  font-family: 'Roboto';
  font-weight: 400;
  outline: none;
  border: transparent 2px solid;
  border-radius: 2px;
  padding: 0 10px;
  height: 25px; 
  width: auto;
  background-color: rgba(240,240,240, 1);
  transition: all .1s linear;
  cursor: pointer;

  &:hover {
    background-color: rgba(240,240,240, .8);
  }
`;

export default GameFunction;