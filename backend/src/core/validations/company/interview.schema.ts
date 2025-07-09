import { z } from "zod";

export const createInterviewSchema = z.object({
  userId: z.string().min(1),
  applicationId: z.string().min(1),
  jobId: z.string().min(1),
  scheduledAt: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format for scheduledAt",
  }),
});

export const proposeRescheduleSchema = z.object({
  jobId: z.string().min(1),
  reason: z.string().min(5).max(1000),
  timeSlots: z
    .array(
      z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid date format in timeSlots",
      })
    )
    .length(3, { message: "Exactly 3 time slots must be provided" }),
});
