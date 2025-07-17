// src/controllers/validators/interviewSchemas.ts
import { z } from "zod";
import { ApplicationStatus } from "../../enums/applicationStatus";

export const UpdateInterviewStatusParamsSchema = z.object({
  applicationId: z.string().min(1, "applicationId is required"),
  status: z.nativeEnum(ApplicationStatus),
});
export const UpdateInterviewStatusRescheduleParamsSchema=z.object({
  applicationId:z.string().min(1,"application is required")
})
export const UpdateInterviewStatusRescheduledSchema = z.object({
  applicationId: z.string().min(1, "applicationId is required"),
  status: z.nativeEnum(ApplicationStatus),
  selectedSlot: z
    .string()
    .datetime()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: "selectedSlot must be a valid ISO date string",
    }),
});
