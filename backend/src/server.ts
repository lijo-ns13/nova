// server.ts
import { createServer } from "http";
import { connectDB } from "./shared/config/db.config";
import app from "./app";
import { initSocketServer } from "./socketServer"; // <-- ADD THIS

const PORT = process.env.PORT || 5000;

(async () => {
  await connectDB();

  const server = createServer(app); // <-- Create HTTP server manually
  initSocketServer(server);         // <-- Initialize socket server here

  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
})();
