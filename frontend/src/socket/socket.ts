// src/socket/socket.ts
import { io } from "socket.io-client";

const socket = io("http://localhost:3000", {
  withCredentials: true,
  transports: ["websocket"],
  autoConnect: false,
});

export default socket;
