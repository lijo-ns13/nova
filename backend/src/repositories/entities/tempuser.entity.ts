import { Document, Types } from "mongoose";

export interface ITempUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  isVerified: boolean;
  expiresAt: Date;
}
