import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";


const ENDPOINT = "http://127.0.0.1:8000";

function App() {
  // response is the data
  // set response is a setter method for the data
  const [response, setResponse] = useState("");

  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);
    socket.on("FromApi", (data: React.SetStateAction<any>) => {
      setResponse(data);
    });
  }, []);

  return (
    <p>
      It's <time dateTime={response}>{response}</time>
    </p>
  );
}

export default App;