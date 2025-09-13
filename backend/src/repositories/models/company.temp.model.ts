import mongoose from "mongoose";

import { tempCompanySchema } from "../schema/temp.company.schema";
import { ITempCompany } from "../entities/temp.comany.entity";

tempCompanySchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
export default mongoose.model<ITempCompany>("TempCompany", tempCompanySchema);
