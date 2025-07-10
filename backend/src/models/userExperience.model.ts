import mongoose, { Document } from "mongoose";

export interface IUserExperience extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  company: string;
  location: string;
  startDate: Date;
  endDate?: Date;
}

const UserExperienceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    location: {
      type: String,
    },
    startDate: {
      type: String,
      required: true,
    },
    endDate: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IUserExperience>(
  "Experience",
  UserExperienceSchema
);
