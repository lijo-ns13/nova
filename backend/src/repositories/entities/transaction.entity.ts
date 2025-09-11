import { Types } from "mongoose";

export interface ITransaction {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  orderId: string;
  amount: number;
  currency: string;
  status: "pending" | "completed" | "failed" | "refunded";
  paymentMethod: string;
  stripeSessionId: string;
  stripeRefundId?: string | null;
  planName: string;
  refundReason?: string | null;
  refundDate?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}
