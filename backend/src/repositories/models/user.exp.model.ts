import mongoose from "mongoose";
import { UserExperienceSchema } from "../schema/user.exp.schema";
import { IUserExperience } from "../entities/experience.entity";

export default mongoose.model<IUserExperience>(
  "Experience",
  UserExperienceSchema
);
