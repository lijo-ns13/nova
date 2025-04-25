import mongoose, { Document, Schema, Types } from "mongoose";

export interface IMedia extends Document {
  _id: Types.ObjectId;
  url: string;
  mimeType: "image/jpeg" | "image/png" | "video/mp4";
  type: "image" | "video";
  ownerId: Types.ObjectId;
  ownerModel: "User" | "Company";
}

const MediaSchema = new Schema<IMedia>(
  {
    url: { type: String, required: true },
    mimeType: {
      type: String,
      required: true,
      enum: ["image/jpeg", "image/png", "video/mp4"],
    },
    type: {
      type: String,
      required: true,
      enum: ["image", "video"],
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      refPath: "ownerModel",
      required: true,
      index: true,
    },
    ownerModel: {
      type: String,
      required: true,
      enum: ["User", "Company"],
    },
  },
  { timestamps: true }
);

MediaSchema.index({ createdAt: -1 });

export default mongoose.model<IMedia>("Media", MediaSchema);
