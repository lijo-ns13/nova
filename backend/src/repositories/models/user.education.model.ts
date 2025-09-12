import mongoose from "mongoose";
import { IUserEducation } from "../entities/education.entity";
import { UserEducationSchema } from "../schema/user.edu.schema";


export default mongoose.model<IUserEducation>("Education", UserEducationSchema);
