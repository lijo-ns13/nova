import mongoose from "mongoose";
import { IFeature } from "../entities/feature.entity";
import { FeatureSchema } from "../schema/feature.schema";

export default mongoose.model<IFeature>("Feature", FeatureSchema);
