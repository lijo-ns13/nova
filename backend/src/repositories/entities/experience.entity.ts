import { Types } from "mongoose";

export interface IUserExperience {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  title: string;
  description?: string;
  company: string;
  location: string;
  startDate: string;
  endDate?: string;
}
