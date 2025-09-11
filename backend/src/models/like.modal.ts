import mongoose, { Schema } from "mongoose";
import { ILike } from "../repositories/entities/like.entity";

const LikeSchema = new Schema<ILike>(
  {
    postId: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

LikeSchema.index({ postId: 1, userId: 1 }, { unique: true });

export default mongoose.model<ILike>("Like", LikeSchema);
