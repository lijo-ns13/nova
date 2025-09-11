import { Types } from "mongoose";

export interface IUserCertificate {
  _id: Types.ObjectId;
  title: string;
  userId: Types.ObjectId;
  issuer: string;
  issueDate: Date;
  expirationDate: Date;
  certificateUrl: string;
  certificateImageUrl: string;
}
