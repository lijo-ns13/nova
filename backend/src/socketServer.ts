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

  const videoRooms = new Map<string, Set<string>>();

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

    socket.on(
      "sendMessage",
      async ({
        sender,
        receiver,
        content,
        tempId,
      }: {
        sender: string;
        receiver: string;
        content: string;
        tempId?: string;
      }) => {
        try {
          console.log("sender,recieiver,content", sender, receiver, content);
          const message = await Message.create({ sender, receiver, content });
          await message.save();
          if (!message) console.log("failed to create message in db");
          const receiverUser = await User.findById(receiver);
          if (receiverUser?.socketId) {
            io.to(receiverUser.socketId).emit("receiveMessage", message);
          }
          console.log("message send socket");
          // Confirm to sender message is sent with the same tempId
          if (tempId) {
            socket.emit(`messageSent-${tempId}`, message);
          } else {
            socket.emit("messageSent", message);
          }
        } catch (error) {
          console.error("Error sending message:", error);
          if (tempId) {
            socket.emit(`messageFailed-${tempId}`);
          }
        }
      }
    );
    socket.on("join-video-room", (roomId: string, userId: string) => {
      console.log(`User ${userId} joining room ${roomId}`);

      socket.join(roomId);

      if (!videoRooms.has(roomId)) {
        videoRooms.set(roomId, new Set());
      }

      const room = videoRooms.get(roomId)!;
      room.add(userId);

      // Notify all users in the room about the new participant
      io.to(roomId).emit("user-connected", userId);

      // Send current participants to the new user
      const participants = Array.from(room).filter((id) => id !== userId);
      socket.emit("video-room-participants", participants);

      console.log(`Room ${roomId} now has ${room.size} participants`);
    });

    socket.on("leave-video-room", (roomId: string, userId: string) => {
      console.log(`User ${userId} leaving room ${roomId}`);

      socket.leave(roomId);

      if (videoRooms.has(roomId)) {
        const room = videoRooms.get(roomId)!;
        room.delete(userId);

        if (room.size === 0) {
          videoRooms.delete(roomId);
        } else {
          // Notify remaining users about the departure
          io.to(roomId).emit("user-disconnected", userId);
        }
      }

      console.log(
        `Room ${roomId} now has ${
          videoRooms.get(roomId)?.size || 0
        } participants`
      );
    });
    // WebRTC signaling
    socket.on("webrtc-signal", ({ roomId, userId, signal }) => {
      socket.to(roomId).emit("webrtc-signal", { userId, signal });
    });

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
