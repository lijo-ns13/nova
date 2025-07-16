// src/core/dtos/admin/admin.sub.dto.ts

import { z } from "zod";

// --- Transaction Status Enum ---
export const TRANSACTION_STATUSES = [
  "pending",
  "completed",
  "failed",
  "refunded",
] as const;

export type TransactionStatus = (typeof TRANSACTION_STATUSES)[number];

// --- Transaction Response DTO ---
export interface TransactionResponseDTO {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  amount: number;
  currency: string;
  status: TransactionStatus;
  paymentMethod: string;
  stripeSessionId: string;
  stripeRefundId: string | null;
  planName: string;
  refundReason: string | null;
  refundDate: string | null;
  createdAt: string;
}

// --- Zod Schema for Filtering Transactions ---
export const transactionFilterSchema = z
  .object({
    status: z.enum(TRANSACTION_STATUSES).optional(),
    planName: z.string().min(1).optional(),
    from: z.string().datetime().optional(),
    to: z.string().datetime().optional(),
    userId: z.string().length(24).optional(),
    isActiveOnly: z.enum(["true", "false"]).optional(),
    page: z.string().regex(/^\d+$/).optional(),
    limit: z.string().regex(/^\d+$/).optional(),
  })
  .strict(); // Disallow extra unexpected query fields

export type TransactionFilterInput = z.infer<typeof transactionFilterSchema>;
