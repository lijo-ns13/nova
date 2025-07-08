import mongoose, { Document, Schema } from "mongoose";

export const IndustryTypes = [
  "Information Technology",
  "Software Development",
  "E-Commerce",
  "Banking & Financial Services",
  "Healthcare",
  "Pharmaceutical",
  "Telecommunications",
  "Education & Training",
  "Manufacturing",
  "Automotive",
  "Construction",
  "Retail",
  "Logistics & Supply Chain",
  "Media & Entertainment",
  "Hospitality",
  "Real Estate",
  "Legal Services",
  "Agriculture",
  "Energy & Utilities",
  "Non-Profit / NGO",
  "Government / Public Administration",
  "Consulting",
  "Human Resources",
  "Marketing & Advertising",
  "Insurance",
  "Aviation / Aerospace",
  "Chemicals",
  "Fashion & Apparel",
  "Mining & Metals",
  "Sports & Fitness",
  "Food & Beverage",
  "Maritime",
  "Defense & Security",
  "Electronics / Electrical",
  "Environmental Services",
  "Research & Development",
  "Arts & Culture",
];

export interface ITempCompany extends Document {
  _id: mongoose.Types.ObjectId;
  companyName: string;
  password: string;
  about?: string;
  email: string;
  industryType: string;
  foundedYear: number;
  website?: string;
  location: string;
  companySize?: number;
  documents: string[];
  verificationStatus: "pending" | "accepted" | "rejected";
  createdAt: Date;
  updatedAt: Date;
}

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
