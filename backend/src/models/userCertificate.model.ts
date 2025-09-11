import mongoose, { Document, Schema } from "mongoose";
import { IUserCertificate } from "../repositories/entities/certificate.entity";

const certificateSchema = new Schema<IUserCertificate>({
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

export default mongoose.model<IUserCertificate>(
  "Certificate",
  certificateSchema
);
