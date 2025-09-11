import mongoose, { Schema } from "mongoose";
import { IPost } from "../repositories/entities/post.entity";

const PostSchema = new Schema<IPost>(
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

// Comments virtual
PostSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "postId",
});
PostSchema.virtual("Likes", {
  ref: "Like",
  localField: "_id",
  foreignField: "postId",
});
export default mongoose.model<IPost>("Post", PostSchema);
