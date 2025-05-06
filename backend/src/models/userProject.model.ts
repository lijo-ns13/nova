import mongoose, { Document, Schema } from "mongoose";

export interface IUserProject extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  projectUrl?: string;
  startDate: Date;
  endDate?: Date;
  technologies: string[];
}

const userProjectSchema = new Schema<IUserProject>({
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

export default mongoose.model<IUserProject>("Project", userProjectSchema);
