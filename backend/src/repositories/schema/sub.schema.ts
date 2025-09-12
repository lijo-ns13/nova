import { Schema } from "mongoose";
import { ISubscriptionPlan } from "../entities/subscription.entity";

export const SubscriptionPlanSchema = new Schema<ISubscriptionPlan>(
  {
    name: {
      type: String,
      enum: ["BASIC", "PRO", "PREMIUM"],
      required: true,
      unique: true,
    },
    price: {
      type: Number,
      required: true,
    },
    validityDays: {
      type: Number,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);
