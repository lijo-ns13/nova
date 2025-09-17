import { z } from "zod";

export const ApplicantDetailSchema = z.object({
  id: z.string(),
  appliedAt: z.date(),
  coverLetter: z.string().optional(),
  status: z.string(),
  scheduledAt: z.date().optional(),
  resumeUrl: z.string().nullable(),
  user: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
    username: z.string(),
    profilePicture: z.string().optional(),
    headline: z.string().optional(),
  }),
  statusHistory: z.array(
    z.object({
      status: z.string(),
      changedAt: z.date(),
      reason: z.string().optional(),
    })
  ),
});

export type ApplicantDetailDTO = z.infer<typeof ApplicantDetailSchema>;
