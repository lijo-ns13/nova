import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { OTPSchema } from "../schema/otp.schema";
import { IOTP } from "../entities/otp.entity";

OTPSchema.pre<IOTP>("save", async function (next) {
  if (!this.isModified("otp")) return next();

  try {
    const saltRounds = 10;
    this.otp = await bcrypt.hash(this.otp, saltRounds);
    next();
  } catch (error) {
    next(error as Error);
  }
});

OTPSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); //expire after 1 minute
export default mongoose.model<IOTP>("OTP", OTPSchema);
