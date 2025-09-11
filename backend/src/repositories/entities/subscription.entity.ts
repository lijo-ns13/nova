import { Types } from "mongoose";

export interface ISubscriptionPlan {
  _id: Types.ObjectId;
  name: "BASIC" | "PRO" | "PREMIUM";
  price: number;
  validityDays: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
