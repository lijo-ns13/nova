import mongoose from "mongoose";
import { MediaSchema } from "../schema/media.schema";
import { IMedia } from "../entities/media.entity";

MediaSchema.index({ createdAt: -1 });

export default mongoose.model<IMedia>("Media", MediaSchema);
