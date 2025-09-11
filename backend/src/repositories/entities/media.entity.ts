import { Types } from "mongoose";

export interface IMedia {
  _id: Types.ObjectId;
  s3Key: string; // store object key, not URL
  mimeType: "image/jpeg" | "image/png" | "video/mp4";
  ownerId: Types.ObjectId;
  ownerModel: "User" | "Company";
  createdAt: Date;
  updatedAt: Date;
}
