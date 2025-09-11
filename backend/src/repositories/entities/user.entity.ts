import { Document, Types } from "mongoose";

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  username: string;
  email: string;
  password?: string;
  profilePicture?: string;
  skills: string[] | [];
  certifications: Types.ObjectId[] | [];
  experiences: Types.ObjectId[] | [];
  educations: Types.ObjectId[] | [];
  projects: Types.ObjectId[] | [];
  followers: Types.ObjectId[] | [];
  following: Types.ObjectId[] | [];
  headline?: string;
  about?: string;
  isBlocked: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  googleId?: string;
  isVerified: boolean;
  appliedJobs: Types.ObjectId[] | [];
  savedJobs: Types.ObjectId[] | [];
  socketId?: string;
  online?: boolean;
  isSubscriptionActive: boolean;
  subscriptionStartDate: Date | null;
  subscriptionEndDate: Date | null;
  subscriptionCancelled: boolean;
  subscription?: Types.ObjectId | null;
  activePaymentSession?: string | null;
  activePaymentSessionExpiresAt?: Date | null;
  appliedJobCount: number;
  createdPostCount: number;
}
