import mongoose, { Document, Schema, Types } from "mongoose";
import { IPasswordResetToken } from "../repositories/entities/password.reset.entity";

const PasswordResetTokenSchema = new Schema<IPasswordResetToken>({
  token: {
    type: String,
    required: true,
  },
  accountId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  accountType: {
    type: String,
    enum: ["user", "company"],
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 }, // TTL index to automatically delete expired tokens
  },
});

export default mongoose.model<IPasswordResetToken>(
  "PasswordResetToken",
  PasswordResetTokenSchema
);
