import React, { useState } from "react";
import socketIOClient from "socket.io-client";
import styled from 'styled-components';

import Game from './components/Game';

const ENDPOINT = "http://127.0.0.1:8000";

function App() {
  // response is the data
  // set response is a setter method for the data
  const [isConnected, setConnection] = useState(false);

  function connectToSocket() {
    const socket = socketIOClient(ENDPOINT);    
    console.log(socket);

    socket.on("FromApi", (data: React.SetStateAction<any>) => {
      setConnection(true);
    });
  }

  function renderPreConnection() {
    return (
      <Container>
        <Title>
          Tractor
      </Title>
        <Button
          onClick={() => { connectToSocket() }}
        >
          Play
      </Button>
      </Container>
    );
  }

  function renderPostConnection() {
    return (
      <Container>
        <Game />
      </Container>
    );
  }

  return isConnected ? renderPostConnection() : renderPreConnection();
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: green;
`;

const Title = styled.h1`
  margin: 5px;
  padding: 0;
`;

const Button = styled.button`
  padding: 3px 7px;
  height: auto;
  cursor: pointer;
`;

export default App;