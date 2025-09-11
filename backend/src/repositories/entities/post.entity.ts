import { Types } from "mongoose";
import { ILike } from "./like.entity";

export interface IPost {
  _id: Types.ObjectId;
  creatorId: Types.ObjectId;
  mediaIds: Types.ObjectId[];
  description?: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  Likes?: ILike[];
}
