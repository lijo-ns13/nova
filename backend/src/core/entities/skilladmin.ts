import { Types } from "mongoose";

export interface SkillWithCreatorEmail {
  _id: Types.ObjectId;
  title: string;
  createdBy: "user" | "company" | "admin";
  createdById: {
    _id: Types.ObjectId;
    email: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
