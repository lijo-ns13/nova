import mongoose, { Schema, Document, Types } from "mongoose";
import { IPost } from "./post.modal";

export interface IComment extends Document {
  _id: Types.ObjectId;
  postId: Types.ObjectId | IPost;
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

const LikeSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    createdAt: { type: Date, default: () => new Date(), index: true },
  },
  { _id: false }
);

const CommentSchema = new Schema<IComment>(
  {
    postId: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
      index: true,
    },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
      index: true,
    },
    authorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    authorName: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    path: {
      type: [Schema.Types.ObjectId],
      default: [],
      index: true,
    },
    likes: {
      type: [LikeSchema],
      default: [],
    },
    likeCount: {
      type: Number,
      default: 0,
      index: true,
    },
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  }
);

export default mongoose.model<IComment>("Comment", CommentSchema);
