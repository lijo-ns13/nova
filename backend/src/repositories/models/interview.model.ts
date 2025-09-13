import mongoose from "mongoose";
import { InterviewSchema } from "../schema/interview.schema";
import { IInterview } from "../entities/interview.entity";

export const Interview = mongoose.model<IInterview>(
  "Interview",
  InterviewSchema
);
