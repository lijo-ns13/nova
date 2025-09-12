import mongoose from "mongoose";
import { IComment } from "../entities/comment.entity";
import { CommentSchema } from "../schema/comment.schema";

export default mongoose.model<IComment>("Comment", CommentSchema);
