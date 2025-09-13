import mongoose from "mongoose";
import { PostSchema } from "../schema/post.schema";
import { IPost } from "../entities/post.entity";

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
