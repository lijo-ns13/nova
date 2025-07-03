// src/socket/socket.ts
// import { io } from "socket.io-client";

// const socket = io(import.meta.env.VITE_API_BASE_URL, {
//   withCredentials: true,
//   transports: ["websocket"],
//   autoConnect: false,
// });
// src/socket/socket.ts

import { io, Socket } from "socket.io-client";
interface VideoParticipant {
  userId: string;
  video: boolean;
  audio: boolean;
  screenSharing?: boolean;
}
// Define types for better TypeScript support
interface VideoCallSocketEvents {
  "join-video-room": (roomId: string, userId: string) => void;
  "leave-video-room": (roomId: string, userId: string) => void;
  "webrtc-signal": (data: {
    roomId: string;
    userId: string;
    signal: any;
  }) => void;
  typing: (data: { sender: string; receiver: string }) => void;
  login: (userId: string) => void;
  readMessages: (data: { sender: string; receiver: string }) => void;

  sendMessage: (data: {
    sender: string;
    receiver: string;
    content: string;
    tempId: string;
  }) => void;

  receiveMessage: (message: any) => void;
  messageSent: (message: any) => void;
  "messageSent-tempId": (message: any) => void; // Optional
  messagesRead: (data: { receiver: string }) => void;
  userOnline: (userId: string) => void;
  userOffline: (userId: string) => void;
  "user-connected": (userId: string) => void;
  "user-disconnected": (userId: string) => void;
  "video-room-participants": (participants: VideoParticipant[]) => void;
  unreadMessages: (messages: any[]) => void;
  "audio-toggle": (data: {
    roomId: string;
    userId: string;
    enabled: boolean;
  }) => void;
  "video-toggle": (data: {
    roomId: string;
    userId: string;
    enabled: boolean;
  }) => void;
  "end-call": (data: { roomId: string; userId: string }) => void;
  "screen-share-toggle": (data: {
    roomId: string;
    userId: string;
    sharing: boolean;
  }) => void;
  // notificationrealted
  newNotification: (notification: any) => void;
  unreadCountUpdate: (data: { count: number }) => void;
}

// Create socket instance
const socket: Socket<VideoCallSocketEvents> = io(
  import.meta.env.VITE_API_BASE_URL,
  {
    withCredentials: true,
    transports: ["websocket"],
    autoConnect: false, // Control connection manually
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    timeout: 20000,
  }
);

// Helper function to ensure proper connection
export const connectSocket = () => {
  if (!socket.connected) {
    console.log("Connecting socket...");
    socket.connect();
  } else {
    console.log("Socket already connected");
  }
};
// Video room functions
export const joinVideoRoom = (roomId: string, userId: string) => {
  console.log(`Joining video room: ${roomId} as user: ${userId}`);
  connectSocket();
  socket.emit("join-video-room", roomId, userId);
};

export const leaveVideoRoom = (roomId: string, userId: string) => {
  console.log(`Leaving video room: ${roomId} as user: ${userId}`);
  socket.emit("leave-video-room", roomId, userId);
};

export const sendSignal = (roomId: string, userId: string, signal: any) => {
  socket.emit("webrtc-signal", { roomId, userId, signal });
};
export const toggleScreenShare = (
  roomId: string,
  userId: string,
  sharing: boolean
) => {
  socket.emit("screen-share-toggle", { roomId, userId, sharing });
};
export default socket;
