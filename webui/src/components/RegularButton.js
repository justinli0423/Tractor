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
const Button = styled.button`
  padding: 3px 7px;
  height: auto;
  width: auto;
  cursor: pointer;
`;

export default GameFunction;