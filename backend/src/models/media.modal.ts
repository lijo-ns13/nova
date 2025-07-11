import mongoose, { Document, Schema, Types } from "mongoose";

export interface IMedia extends Document {
  _id: Types.ObjectId;
  s3Key: string; // store object key, not URL
  mimeType: "image/jpeg" | "image/png" | "video/mp4";
  ownerId: Types.ObjectId;
  ownerModel: "User" | "Company";
  createdAt: Date;
  updatedAt: Date;
}

const MediaSchema = new Schema<IMedia>(
  {
    s3Key: { type: String, required: true, index: true },
    mimeType: {
      type: String,
      required: true,
      enum: [
        "image/jpeg",
        "image/png",
        "video/mp4",
        "application/pdf",
        "video/quicktime",
        "image/webp",
      ],
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
