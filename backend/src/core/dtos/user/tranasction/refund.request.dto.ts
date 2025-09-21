// dtos/request/refund.request.dto.ts
import { z } from "zod";

export const RefundRequestSchema = z.object({
  stripeSessionId: z.string(),
  reason: z.string().optional(),
});

export type RefundRequestInput = z.infer<typeof RefundRequestSchema>;

// dtos/response/refund.response.dto.ts
export interface RefundResponseDTO {
  message: string;
  refundId: string;
}
