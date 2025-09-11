import { Types } from "mongoose";

export interface IUserEducation {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  institutionName: string;
  degree: string;
  fieldOfStudy?: string;
  grade?: string;
  startDate: string;
  endDate?: string;
  description?: string;
  createdAt?: Date;
  updateAt?: Date;
}
