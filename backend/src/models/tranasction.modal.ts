import mongoose, { Document, Schema, Types } from "mongoose";

export interface ITransaction extends Document {
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

const TransactionSchema = new Schema<ITransaction>({
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

export default mongoose.model<ITransaction>("Transaction", TransactionSchema);
