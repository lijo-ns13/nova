import mongoose, { Schema, Document, Types } from "mongoose";
import { IFeature } from "../repositories/entities/feature.entity";

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
