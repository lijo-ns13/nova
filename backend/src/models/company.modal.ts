import bcrypt from "bcryptjs";
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

export interface ICompany extends Document {
  _id: mongoose.Types.ObjectId;
  companyName: string;
  username: string;
  password: string;
  about: string;
  email: string;
  industryType: string;
  foundedYear: number;
  website: string;
  location: string;
  companySize: number;
  jobPosted: mongoose.Types.ObjectId[];
  documents: string[];
  isVerified: boolean;
  verificationStatus: "pending" | "accepted" | "rejected";
  isBlocked: boolean;
  profilePicture?: string;
  socketId?: string;
  online?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const companySchema = new Schema<ICompany>(
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
companySchema.pre("save", async function (next) {
  const user = this;

  if (!user.isModified("password")) {
    return next();
  }

  try {
    const saltRounds = 10;
    // ✅ Skip if already hashed (check password length or bcrypt hash pattern)
    if (user.password && user.password.startsWith("$2b$")) {
      return next(); // already hashed, no need to rehash
    }
    user.password = await bcrypt.hash(user.password, saltRounds);
    next();
  } catch (err) {
    next(err as Error);
  }
});

export default mongoose.model<ICompany>("Company", companySchema);
