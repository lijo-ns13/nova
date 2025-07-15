import { AppEventEmitter } from "./event/AppEventEmitter";
import { Server as SocketIOServer } from "socket.io";

export const registerLikeEvents = (io: SocketIOServer) => {
  AppEventEmitter.on("post:like", ({ postId, userId, liked }) => {
    io.to(`post:${postId}`).emit("post:like", { postId, userId, liked });
  });
};
