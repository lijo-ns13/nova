// src/models/feature.modal.ts
import mongoose, { Schema, Document, Types } from "mongoose";

export interface IFeature extends Document {
  _id: Types.ObjectId;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const FeatureSchema = new Schema<IFeature>(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      unique: [true, "unique one is required"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IFeature>("Feature", FeatureSchema);
