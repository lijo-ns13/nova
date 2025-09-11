import mongoose, { Document } from "mongoose";
import { IUserEducation } from "../repositories/entities/education.entity";

const UserEducationSchema = new mongoose.Schema<IUserEducation>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    institutionName: {
      type: String,
      required: true,
    },
    degree: {
      type: String,
      required: true,
    },
    fieldOfStudy: {
      type: String,
    },
    grade: {
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
    description: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IUserEducation>("Education", UserEducationSchema);
