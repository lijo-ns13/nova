import mongoose, { Schema, Document, Types } from "mongoose";

export interface ISubscriptionPlan extends Document {
  _id: Types.ObjectId;
  name: "BASIC" | "PRO" | "PREMIUM";
  price: number;
  validityDays: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionPlanSchema = new Schema<ISubscriptionPlan>(
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

export default mongoose.model<ISubscriptionPlan>(
  "SubscriptionPlan",
  SubscriptionPlanSchema
);
