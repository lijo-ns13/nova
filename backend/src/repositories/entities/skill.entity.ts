import { Types } from "mongoose";

export interface ISkill {
  _id: Types.ObjectId;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  createdById?: Types.ObjectId;
  createdBy?: "user" | "company" | "admin";
}
