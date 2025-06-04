import mongoose, { Document, Schema, Types } from "mongoose";

export interface IAdmin extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  socketId?: string;
  online?: boolean;
}

const AdminSchema = new Schema<IAdmin>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    socketId: {
      type: String,
      default: null,
    },
    online: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Admin = mongoose.model<IAdmin>("Admin", AdminSchema);
