import { Document, Types } from "mongoose";

export interface ILike extends Document {
  _id: Types.ObjectId;
  postId: Types.ObjectId;
  userId: Types.ObjectId;
  createdAt: Date;
}
