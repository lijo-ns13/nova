import mongoose, { Document, Schema, Types } from "mongoose";
import bcrypt from "bcrypt";
export interface IOTP extends Document {
  _id: Types.ObjectId;
  accountId: Types.ObjectId;
  accountType: string;
  otp: string;
  expiresAt: Date;
  createdAt: Date;
  attempts: number;
}

const OTPSchema = new Schema<IOTP>(
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
