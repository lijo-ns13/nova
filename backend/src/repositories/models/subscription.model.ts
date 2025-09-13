import mongoose, { Schema } from "mongoose";
import { SubscriptionPlanSchema } from "../schema/sub.schema";
import { ISubscriptionPlan } from "../entities/subscription.entity";

export default mongoose.model<ISubscriptionPlan>(
  "SubscriptionPlan",
  SubscriptionPlanSchema
);
