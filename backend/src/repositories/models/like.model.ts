import mongoose from "mongoose";
import { ILike } from "../entities/like.entity";
import { LikeSchema } from "../schema/like.schema";

LikeSchema.index({ postId: 1, userId: 1 }, { unique: true });

export default mongoose.model<ILike>("Like", LikeSchema);
