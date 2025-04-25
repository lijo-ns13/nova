import mongoose, { Document, Schema, Types } from "mongoose";

export interface IPost extends Document {
  creatorId: Types.ObjectId;
  creatorName: string;
  creatorAvatar?: string;
  mediaIds: Types.ObjectId[];
  description?: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPost>(
  {
    creatorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    creatorName: { type: String, required: true },
    creatorAvatar: { type: String },
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

export default mongoose.model<IPost>("Post", PostSchema);
