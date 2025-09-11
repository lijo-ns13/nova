import { Types } from "mongoose";

export interface ICompany {
  _id: Types.ObjectId;
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
  jobPosted: Types.ObjectId[];
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
