import { Document, Types } from "mongoose";

export interface ISkill extends Document {
  _id: Types.ObjectId;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  createdById?: Types.ObjectId;
  createdBy?: "user" | "company" | "admin";
}
export interface SkillIdEntity {
  id: string;
}
export interface SkillTitleEntity {
  title: string;
}
