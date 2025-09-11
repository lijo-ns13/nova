import { Document, Types } from "mongoose";

export interface IOTP extends Document {
  _id: Types.ObjectId;
  accountId: Types.ObjectId;
  accountType: string;
  otp: string;
  expiresAt: Date;
  createdAt: Date;
  attempts: number;
}
