import mongoose from "mongoose";
import { PasswordResetTokenSchema } from "../schema/password.reset.schema";
import { IPasswordResetToken } from "../entities/password.reset.entity";

export default mongoose.model<IPasswordResetToken>(
  "PasswordResetToken",
  PasswordResetTokenSchema
);
