// src/validations/user/userCertificate.schema.ts

import { z } from "zod";

export const CreateCertificateInputSchema = z.object({
  title: z.string().min(1),
  issuer: z.string().min(1),
  issueDate: z.coerce.date(), // parses ISO string → Date
  expirationDate: z.coerce.date().optional(),
  certificateUrl: z.string().url().optional(),
  certificateImageUrl: z.string().min(1),
});

export const UpdateCertificateInputSchema =
  CreateCertificateInputSchema.partial();
