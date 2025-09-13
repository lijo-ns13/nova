import { Schema } from "mongoose";
import { IFeature } from "../entities/feature.entity";

export const FeatureSchema = new Schema<IFeature>(
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
