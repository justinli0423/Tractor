import socketIOClient from "socket.io-client";

const ENDPOINT = "http://127.0.0.1:8000";

export function connectToSocket() {
  return socketIOClient(ENDPOINT);
  // socket.on("FromApi", (data: React.SetStateAction<any>) => {
  //   setConnection(true);
  // });
}