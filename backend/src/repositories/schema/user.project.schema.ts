import mongoose, { Schema } from "mongoose";
import { IUserProject } from "../entities/project.entity";

export const userProjectSchema = new Schema<IUserProject>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  projectUrl: {
    type: String,
    default: null,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    default: null,
  },
  technologies: {
    type: [String],
    required: true,
  },
});
