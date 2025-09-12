import { Document, Types } from "mongoose";

export interface IFeature extends Document {
  _id: Types.ObjectId;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface FeatureNameEntity {
  name: string;
}
export interface FeatureIdEntity {
  id: string;
}
