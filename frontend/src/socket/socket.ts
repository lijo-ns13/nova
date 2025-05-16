// src/socket/socket.ts
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_API_BASE_URL, {
  withCredentials: true,
  transports: ["websocket"],
  autoConnect: false,
});

export default socket;
