import mongoose, { Document, Schema } from "mongoose";

export interface IUserCertificate extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  userId: mongoose.Types.ObjectId;
  issuer: string;
  issueDate: Date;
  expirationDate: Date;
  certificateUrl: string;
  certificateImageUrl: string;
}

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
