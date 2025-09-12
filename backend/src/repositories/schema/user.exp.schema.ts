import mongoose from "mongoose";
import { IUserExperience } from "../entities/experience.entity";

export const UserExperienceSchema = new mongoose.Schema<IUserExperience>(
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
