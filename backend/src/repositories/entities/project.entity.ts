import { Types } from "mongoose";

export interface IUserProject {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  title: string;
  description: string;
  projectUrl?: string;
  startDate: Date;
  endDate?: Date;
  technologies: string[];
}
