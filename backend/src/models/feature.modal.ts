// src/models/feature.modal.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IFeature extends Document {
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const FeatureSchema = new Schema<IFeature>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IFeature>("Feature", FeatureSchema);
