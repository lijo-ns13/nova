import mongoose from "mongoose";
import { AdminSchema } from "../schema/admin.schema";
import { IAdmin } from "../entities/admin.entity";

export const Admin = mongoose.model<IAdmin>("Admin", AdminSchema);
