import { z } from "zod";

export const getApplicationsQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  status: z.string().optional(),
});

export const rejectApplicationBodySchema = z.object({
  rejectionReason: z.string().min(1).max(1000),
});
