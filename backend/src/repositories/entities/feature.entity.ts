import { Types } from "mongoose";

export interface IFeature  {
  _id: Types.ObjectId;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}