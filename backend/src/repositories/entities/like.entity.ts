import { Document, Types } from "mongoose";

export interface ILike extends Document {
  _id: Types.ObjectId;
  postId: Types.ObjectId;
  userId: Types.ObjectId;
  createdAt: Date;
}
export interface ILikePopulated {
  _id: Types.ObjectId;
  postId: Types.ObjectId;
  userId: {
    _id: Types.ObjectId;
    name: string;
    username: string;
    profilePicture?: string;
  };
  createdAt: Date;
}
