// socket/socketServer.ts
import { Server as SocketIOServer } from "socket.io";
import { Server } from "http";
import userModal from "./models/user.modal";
import messageModal from "./models/message.modal";
import {
  updateSocketInfo,
  updateSocketInfoBySocketId,
} from "./utils/getUserSocketData";

// Store the io instance globally after initialization
let ioInstance: SocketIOServer;

export const initSocketServer = (server: Server) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:5173",
      credentials: true,
    },
  });

  ioInstance = io; // Store the instance

  const videoRooms = new Map<string, Set<string>>();

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    // Login handler
    socket.on("login", async (userId: string) => {
      await updateSocketInfo(userId, socket.id);

      io.emit("userOnline", userId);

      const unreadMessages = await messageModal
        .find({
          receiver: userId,
          isRead: false,
        })
        .sort({ timestamp: 1 });

      socket.emit("unreadMessages", unreadMessages);
    });

    // Send message handler
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
          const message = await messageModal.create({
            sender,
            receiver,
            content,
          });
          const receiverUser = await userModal.findById(receiver);

          if (receiverUser?.socketId) {
            io.to(receiverUser.socketId).emit("receiveMessage", message);
          }

          if (tempId) {
            socket.emit(`messageSent-${tempId}`, message);
          } else {
            socket.emit("messageSent", message);
          }
        } catch (error) {
          console.error("Error sending message:", error);
          if (tempId) socket.emit(`messageFailed-${tempId}`);
        }
      }
    );

    // Video call logic
    socket.on("join-video-room", (roomId: string, userId: string) => {
      socket.join(roomId);

      if (!videoRooms.has(roomId)) {
        videoRooms.set(roomId, new Set());
      }

      const room = videoRooms.get(roomId)!;
      room.add(userId);

      io.to(roomId).emit("user-connected", userId);
      const participants = Array.from(room).filter((id) => id !== userId);
      socket.emit("video-room-participants", participants);
    });

    socket.on("leave-video-room", (roomId: string, userId: string) => {
      socket.leave(roomId);

      if (videoRooms.has(roomId)) {
        const room = videoRooms.get(roomId)!;
        room.delete(userId);

        if (room.size === 0) {
          videoRooms.delete(roomId);
        } else {
          io.to(roomId).emit("user-disconnected", userId);
        }
      }
    });

    socket.on("webrtc-signal", ({ roomId, userId, signal }) => {
      socket.to(roomId).emit("webrtc-signal", { userId, signal });
    });

    // Typing indicator
    socket.on("typing", ({ sender, receiver }) => {
      userModal.findById(receiver).then((receiverUser) => {
        if (receiverUser?.socketId) {
          io.to(receiverUser.socketId).emit("typing", { sender });
        }
      });
    });

    // Mark messages as read
    socket.on("readMessages", async ({ sender, receiver }) => {
      await messageModal.updateMany(
        { sender, receiver, isRead: false },
        { isRead: true }
      );

      const senderUser = await userModal.findById(sender);
      if (senderUser?.socketId) {
        io.to(senderUser.socketId).emit("messagesRead", { receiver });
      }
    });

    // Call toggles
    socket.on("video-toggle", ({ roomId, userId, enabled }) => {
      socket.to(roomId).emit("video-toggle", { userId, enabled });
    });

    socket.on("audio-toggle", ({ roomId, userId, enabled }) => {
      socket.to(roomId).emit("audio-toggle", { userId, enabled });
    });

    socket.on("end-call", ({ roomId, userId }) => {
      socket.to(roomId).emit("end-call", { userId });
    });

    // Disconnect logic
    socket.on("disconnect", async () => {
      const user = await updateSocketInfoBySocketId(socket.id);

      if (user) {
        io.emit("userOffline", user._id);
      }

      console.log("Socket disconnected:", socket.id);
    });
  });
};

// Export getter for external use (e.g., in notification service or DI)
export const getSocketIO = () => ioInstance;
