import mongoose from "mongoose";
import { IUserProject } from "../entities/project.entity";
import { userProjectSchema } from "../schema/user.project.schema";

export default mongoose.model<IUserProject>("Project", userProjectSchema);
