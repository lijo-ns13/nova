// socket/socketServer.ts
import { Server as SocketIOServer } from "socket.io";
import { Server } from "http";
import userModal from "./models/user.modal";
import messageModal from "./models/message.modal";
import {
  updateSocketInfo,
  updateSocketInfoBySocketId,
} from "./utils/getUserSocketData";
import container from "./di/container";
import { NotificationService } from "./services/notificationService";
import { TYPES } from "./di/types";
import { NotificationType } from "./models/notification.modal";
const notificationService = container.get<NotificationService>(
  TYPES.NotificationService
);

// Store the io instance globally after initialization
let ioInstance: SocketIOServer;

export const initSocketServer = (server: Server) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true,
    },
  });

  ioInstance = io; // Store the instance

  const videoRooms = new Map<
    string,
    Map<string, { video: boolean; audio: boolean; screenSharing?: boolean }>
  >();

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
          const senderUser = await userModal.findById(sender);
          if (receiverUser?.socketId) {
            io.to(receiverUser.socketId).emit("receiveMessage", message);
          }

          if (tempId) {
            socket.emit(`messageSent-${tempId}`, message);
          } else {
            socket.emit("messageSent", message);
          }
          await notificationService.sendNotification(
            receiver,
            `${senderUser?.name} new message`,
            NotificationType.COMMENT,
            sender
          );
        } catch (error) {
          console.error("Error sending message:", error);
          if (tempId) socket.emit(`messageFailed-${tempId}`);
        }
      }
    );

    // Video call logic
    socket.on("join-video-room", (roomId: string, userId: string) => {
      socket.join(roomId);

      // If room doesn't exist, initialize it
      if (!videoRooms.has(roomId)) {
        videoRooms.set(roomId, new Map());
      }

      const room = videoRooms.get(roomId)!;

      // Set initial audio/video state as enabled by default
      room.set(userId, { video: true, audio: true });

      // Notify others in the room that this user has connected
      io.to(roomId).emit("user-connected", userId);

      // Send current participants (including their media states) to the newly joined user
      const participants = Array.from(room.entries())
        .filter(([id]) => id !== userId)
        .map(([id, state]) => ({ userId: id, ...state }));

      socket.emit("video-room-participants", participants);
    });
    socket.on("leave-video-room", (roomId: string, userId: string) => {
      socket.leave(roomId);

      const room = videoRooms.get(roomId);
      if (room) {
        room.delete(userId);

        if (room.size === 0) {
          videoRooms.delete(roomId);
        } else {
          io.to(roomId).emit("user-disconnected", userId);
        }
      }
    });
    socket.on("screen-share-toggle", ({ roomId, userId, sharing }) => {
      console.log(
        `Screen sharing ${sharing ? "started" : "stopped"} by ${userId}`
      );

      const room = videoRooms.get(roomId);
      if (room?.has(userId)) {
        room.get(userId)!.screenSharing = sharing;
      }

      // Notify others in the room
      socket.to(roomId).emit("screen-share-toggle", { userId, sharing });
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
    // Ensure these handlers are properly forwarding the events
    socket.on("audio-toggle", ({ roomId, userId, enabled }) => {
      console.log(`Audio ${enabled ? "unmuted" : "muted"} by ${userId}`);
      const room = videoRooms.get(roomId);
      if (room?.has(userId)) {
        room.get(userId)!.audio = enabled;
      }
      socket.to(roomId).emit("audio-toggle", { userId, enabled });
    });

    socket.on("video-toggle", ({ roomId, userId, enabled }) => {
      console.log(`Video ${enabled ? "enabled" : "disabled"} by ${userId}`);
      const room = videoRooms.get(roomId);
      if (room?.has(userId)) {
        room.get(userId)!.video = enabled;
      }
      socket.to(roomId).emit("video-toggle", { userId, enabled });
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
