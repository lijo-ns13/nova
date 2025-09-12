import mongoose from "mongoose";
import { IMessage } from "../entities/message.entity";

export const MessageSchema = new mongoose.Schema<IMessage>(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: String,
    isRead: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);
