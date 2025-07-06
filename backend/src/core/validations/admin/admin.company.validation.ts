import { z } from "zod";

export const companyIdSchema = z.object({
  companyId: z.string().length(24, "Invalid company ID"),
});

export const verifyCompanySchema = z.object({
  status: z.enum(["accepted", "rejected"]),
  rejectionReason: z.string().optional(),
});

export const paginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
});

export const companyVerificationSchema = z.object({
  status: z.enum(["accepted", "rejected"]),
  rejectionReason: z.string().optional(),
});
