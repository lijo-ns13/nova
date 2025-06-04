// server.ts
import { ExpressPeerServer } from "peerjs-server";
import { createServer } from "http";
import { connectDB } from "./shared/config/db.config";
import app from "./app";
import { initSocketServer, getSocketIO } from "./socketServer";
import container from "./di/container";
import { TYPES } from "./di/types";
import { INotificationService } from "./interfaces/services/INotificationService";
import { NotificationService } from "./services/notificationService";
const PORT = process.env.PORT || 3000;

(async () => {
  await connectDB();

  const server = createServer(app); // <-- Create HTTP server manually
  initSocketServer(server); // <-- Initialize socket server here
  const io = getSocketIO(); // retrieve stored io instance
  container.bind(TYPES.SocketIO).toConstantValue(io); // ✅ Only now bind it

  const notificationService = container.get<INotificationService>(
    TYPES.NotificationService
  );
  // Cast to concrete type to call setSocketIO
  (notificationService as NotificationService).setSocketIO(io);

  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
})();
