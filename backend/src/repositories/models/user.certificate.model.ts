import mongoose from "mongoose";
import { IUserCertificate } from "../entities/certificate.entity";
import { certificateSchema } from "../schema/user.cert.schema";

export default mongoose.model<IUserCertificate>(
  "Certificate",
  certificateSchema
);
