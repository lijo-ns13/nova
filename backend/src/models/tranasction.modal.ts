import mongoose, { Document, Schema } from "mongoose";

export interface ITransaction extends Document {
  userId: mongoose.Types.ObjectId;
  amount: number;
  currency: string;
  status: "pending" | "completed" | "failed" | "refunded";
  paymentMethod: string;
  stripeSessionId: string;
  planName: string;
  createdAt: Date;
  refundReason?: string;
  refundDate?: Date;
  stripeRefundId?: string;
}

const TransactionSchema = new Schema<ITransaction>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
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
