import { Document, Types } from "mongoose";
import { ILike } from "./like.entity";

export interface IPost extends Document {
  _id: Types.ObjectId;
  creatorId: Types.ObjectId;
  mediaIds: Types.ObjectId[];
  description?: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  Likes?: ILike[];
}
