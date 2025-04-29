import mongoose, { Document, Schema, Types } from "mongoose";
import { IUser } from "./user.modal";
import { ILike } from "./like.modal";

export interface IPost extends Document {
  creatorId: IUser | Types.ObjectId;
  mediaIds: Types.ObjectId[];
  description?: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  Likes?: ILike[];
}

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
