// src/validations/notification.schema.ts
import { z } from "zod";

export const NotificationIdParamSchema = z.object({
  notificationId: z.string().length(24, "Invalid notificationId"),
});

export const PaginationQuerySchema = z.object({
  limit: z.string().optional().transform(Number).default("20"),
  page: z.string().optional().transform(Number).default("1"),
});
