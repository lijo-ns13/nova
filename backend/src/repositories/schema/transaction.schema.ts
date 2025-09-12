import { Schema } from "mongoose";
import { ITransaction } from "../entities/transaction.entity";

export const TransactionSchema = new Schema<ITransaction>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  orderId: { type: String, required: true },
  currency: { type: String, default: "inr" },
  status: {
    type: String,
    enum: ["pending", "completed", "failed", "refunded"],
    default: "pending",
  },
  paymentMethod: { type: String, required: true },
  stripeSessionId: { type: String, required: true },
  planName: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  refundReason: { type: String, default: null },
  refundDate: { type: Date, default: null },
  stripeRefundId: { type: String, default: null },
});
