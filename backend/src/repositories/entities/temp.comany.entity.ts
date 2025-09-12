import { Document, Types } from "mongoose";

export interface ITempCompany extends Document {
  _id: Types.ObjectId;
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
