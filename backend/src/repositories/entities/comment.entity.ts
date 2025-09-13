import { Document, Types } from "mongoose";

export interface IComment extends Document {
  _id: Types.ObjectId;
  postId: Types.ObjectId;
  parentId: Types.ObjectId | null;
  authorId: Types.ObjectId;
  authorName: string;
  content: string;
  path: Types.ObjectId[];
  likes: { userId: Types.ObjectId; createdAt: Date }[];
  likeCount: number;
  createdAt: Date;
  updatedAt: Date;
}
