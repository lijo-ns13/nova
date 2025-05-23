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
      dbName: process.env.DB_NAME || "test_db",
    });
    console.log("MongoDB connnected successfully✅");
  } catch (error) {
    console.log("❌MongoDB connection error:", error);
    process.exit(1);
  }
};
