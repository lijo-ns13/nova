import { z } from "zod";
export interface TransactionResponseDTO {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  amount: number;
  currency: string;
  status: string;
  paymentMethod: string;
  stripeSessionId: string;
  stripeRefundId: string | null;
  planName: string;
  refundReason: string | null;
  refundDate: string | null;
  createdAt: string;
}

export const TRANSACTION_STATUSES = [
  "pending",
  "completed",
  "failed",
  "refunded",
] as const;
export type TransactionStatus = (typeof TRANSACTION_STATUSES)[number];

export const transactionFilterSchema = z.object({
  status: z.enum(TRANSACTION_STATUSES).optional(),
  planName: z.string().optional(),
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
  userId: z.string().optional(),
  isActiveOnly: z.union([z.literal("true"), z.literal("false")]).optional(),
});

export type TransactionFilterInput = z.infer<typeof transactionFilterSchema>;
