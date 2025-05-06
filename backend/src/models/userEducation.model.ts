import mongoose, { Document } from "mongoose";

export interface IUserEducation extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  institutionName: string;
  degree: string;
  fieldOfStudy?: string;
  grade?: string;
  startDate: Date;
  endDate?: Date;
  description?: string;
  createdAt?: Date;
  updateAt?: Date;
}

const UserEducationSchema = new mongoose.Schema(
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
