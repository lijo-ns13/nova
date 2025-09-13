import { Schema } from "mongoose";
import { IPost } from "../entities/post.entity";

export const PostSchema = new Schema<IPost>(
  {
    creatorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    mediaIds: [{ type: Schema.Types.ObjectId, ref: "Media" }],
    description: { type: String, trim: true },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
