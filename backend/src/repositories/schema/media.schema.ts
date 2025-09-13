import { Schema } from "mongoose";
import { IMedia } from "../entities/media.entity";

export const MediaSchema = new Schema<IMedia>(
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
