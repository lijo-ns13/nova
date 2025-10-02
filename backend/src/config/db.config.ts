import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "";

export const connectDB = async () => {
  try {
    if (!MONGODB_URI) {
      throw new Error("MongoDB connection string is missing!");
    }
    await mongoose.connect(MONGODB_URI, {
      maxPoolSize: 50, // handle concurrent requests better
      minPoolSize: 5, // keep a few persistent connections
      serverSelectionTimeoutMS: 5000, // fail fast if cluster unreachable
      socketTimeoutMS: 45000, // avoid long idle sockets
    });
    // await mongoose.connect(MONGODB_URI, {
    //   dbName: process.env.DB_NAME || "test_db",
    // });
    console.log("MongoDB connnected successfully✅");
  } catch (error) {
    console.log("❌MongoDB connection error:", error);
    process.exit(1);
  }
};
