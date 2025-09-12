import { Schema } from "mongoose";
import { IPasswordResetToken } from "../entities/password.reset.entity";

export const PasswordResetTokenSchema = new Schema<IPasswordResetToken>({
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
