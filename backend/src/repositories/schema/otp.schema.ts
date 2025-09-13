import mongoose, { Schema } from "mongoose";
import { IOTP } from "../entities/otp.entity";

export const OTPSchema = new Schema<IOTP>(
  {
    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    accountType: {
      type: String,
      enum: ["user", "company"],
      default: "user",
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    attempts: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);
