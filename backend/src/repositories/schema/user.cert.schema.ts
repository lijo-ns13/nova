import mongoose, { Schema } from "mongoose";
import { IUserCertificate } from "../entities/certificate.entity";

export const certificateSchema = new Schema<IUserCertificate>({
  title: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  issuer: {
    type: String,
    required: true,
  },
  issueDate: {
    type: Date,
    required: true,
  },
  expirationDate: {
    type: Date,
  },
  certificateUrl: {
    type: String,
  },
  certificateImageUrl: {
    type: String,
    required: true,
  },
});
