import mongoose, { Document, Schema } from "mongoose";
import { IndustryTypes } from "../constants/industrytypes";
import { ITempCompany } from "../repositories/entities/temp.comany.entity";

const tempCompanySchema = new Schema<ITempCompany>(
  {
    companyName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    about: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true, // To avoid duplicates
    },
    industryType: {
      type: String,
      enum: IndustryTypes,
      required: true,
    },
    foundedYear: {
      type: Number,
      required: true,
    },
    website: {
      type: String,
    },
    location: {
      type: String,
      required: true,
    },
    companySize: {
      type: Number,
    },
    documents: [
      {
        type: String,
        required: true,
      },
    ],
    verificationStatus: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);
tempCompanySchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
export default mongoose.model<ITempCompany>("TempCompany", tempCompanySchema);
