// socket/socketServer.ts
import { Server as SocketIOServer } from "socket.io";
import { Server } from "http";
import User from "./models/user.modal";
import Message from "./models/message.modal";

export const initSocketServer = (server: Server) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("login", async (userId: string) => {
      await User.findByIdAndUpdate(userId, {
        online: true,
        socketId: socket.id,
      });
      io.emit("userOnline", userId);
    });

    socket.on("sendMessage", async ({ sender, receiver, content }) => {
      const message = await Message.create({ sender, receiver, content });
      const receiverUser = await User.findById(receiver);
      if (receiverUser?.socketId) {
        io.to(receiverUser.socketId).emit("receiveMessage", message);
      }
      socket.emit("messageSent", message);
    });

    socket.on("typing", ({ sender, receiver }) => {
      io.to(receiver).emit("typing", { sender });
    });

    socket.on("readMessages", async ({ sender, receiver }) => {
      await Message.updateMany(
        { sender, receiver, isRead: false },
        { isRead: true }
      );
      io.to(sender).emit("messagesRead", { receiver });
    });

    socket.on("disconnect", async () => {
      const user = await User.findOneAndUpdate(
        { socketId: socket.id },
        { online: false, socketId: null }
      );
      if (user) {
        io.emit("userOffline", user._id);
      }
    });
  });
};
