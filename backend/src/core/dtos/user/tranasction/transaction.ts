import { Types } from "mongoose";

export interface CreateCheckoutSessionInput {
  userId: string;
  price: number;
  metadata: Record<string, any>;
}

export interface CreateCheckoutSessionOutput {
  url: string;
  sessionId: string;
}
export interface ConfirmPaymentInput {
  sessionId: string;
}

export interface ConfirmPaymentOutput {
  orderId: string;
  amount: number;
  currency: string;
  planName: string;
  sessionId: string;
  expiresAt: Date;
  receiptUrl: string | null;
}
// dtos/response/transaction.response.dto.ts
export interface LatestTransactionDTO {
  stripeSessionId: string;
  planName: string;
  amount: number;
  currency: string;
  createdAt: Date;
}
export interface TransactionDetailsDTO {
  stripeSessionId: string;
  userId: Types.ObjectId;
  planName: string;
  amount: number;
  currency: string;
  status: string;
  paymentMethod: string;
  createdAt: Date;
  updatedAt: Date;
  refundDate?: Date | null;
  refundReason?: string | null;
  stripeRefundId?: string | null;
}
