// socket/socketServer.ts
import { Server as SocketIOServer } from "socket.io";
import { Server } from "http";
import User from "./models/user.modal";
import Message from "./models/message.modal";

export const initSocketServer = (server: Server) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: process.env.FRONTEND_URL || `http://localhost:5173`,
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    // User login: set online + socketId + send unread messages
    socket.on("login", async (userId: string) => {
      await User.findByIdAndUpdate(userId, {
        online: true,
        socketId: socket.id,
      });

      io.emit("userOnline", userId);

      // Fetch unread messages for this user
      const unreadMessages = await Message.find({
        receiver: userId,
        isRead: false,
      }).sort({ timestamp: 1 });

      // Send unread messages to user
      socket.emit("unreadMessages", unreadMessages);
    });

    // Sending a new message
    socket.on(
      "sendMessage",
      async ({
        sender,
        receiver,
        content,
      }: {
        sender: string;
        receiver: string;
        content: string;
      }) => {
        const message = await Message.create({ sender, receiver, content });

        const receiverUser = await User.findById(receiver);
        if (receiverUser?.socketId) {
          io.to(receiverUser.socketId).emit("receiveMessage", message);
        }
        // Confirm to sender message is sent
        socket.emit("messageSent", message);
      }
    );

    // Typing indicator
    socket.on("typing", ({ sender, receiver }) => {
      User.findById(receiver).then((receiverUser) => {
        if (receiverUser?.socketId) {
          io.to(receiverUser.socketId).emit("typing", { sender });
        }
      });
    });

    // Mark messages as read
    socket.on("readMessages", async ({ sender, receiver }) => {
      await Message.updateMany(
        { sender, receiver, isRead: false },
        { isRead: true }
      );

      // Notify sender that receiver read messages
      const senderUser = await User.findById(sender);
      if (senderUser?.socketId) {
        io.to(senderUser.socketId).emit("messagesRead", { receiver });
      }
    });

    // User disconnect: mark offline and remove socketId
    socket.on("disconnect", async () => {
      const user = await User.findOneAndUpdate(
        { socketId: socket.id },
        { online: false, socketId: null }
      );

      if (user) {
        io.emit("userOffline", user._id);
      }

      console.log("Socket disconnected:", socket.id);
    });
  });
};
