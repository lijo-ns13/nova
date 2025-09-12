import mongoose, { Schema } from "mongoose";
import { IndustryTypes } from "../../constants/industrytypes";
import { ICompany } from "../entities/company.entity";

export const companySchema = new Schema<ICompany>(
  {
    companyName: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: false,
      trim: true,
      unique: true,
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
    jobPosted: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Job",
    },
    documents: [
      {
        type: String,
        required: true,
      },
    ],
    isVerified: {
      type: Boolean,
      default: false,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    verificationStatus: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    profilePicture: {
      type: String,
      default: "",
    },
    socketId: {
      type: String,
      default: null,
    },
    online: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
