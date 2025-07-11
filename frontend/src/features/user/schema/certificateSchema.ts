import { z } from "zod";

// Shared base for DRY validation
const CertificateBaseSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  issuer: z.string().trim().min(1, "Issuer is required"),
  issueDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid issue date",
    })
    .refine((val) => new Date(val) <= new Date(), {
      message: "Issue date cannot be in the future",
    }),
  expirationDate: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: "Invalid expiration date",
    }),
  certificateUrl: z
    .string()
    .trim()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")), // allow empty string
  certificateImageUrl: z
    .string()
    .trim()
    .min(1, "Certificate image is required"),
});

// Full create schema
export const CreateCertificateInputSchema = CertificateBaseSchema.superRefine(
  (data, ctx) => {
    if (data.expirationDate) {
      const exp = new Date(data.expirationDate);
      const issue = new Date(data.issueDate);
      if (exp < issue) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["expirationDate"],
          message: "Expiration date must be after issue date",
        });
      }
    }
  }
);

// Strict update schema (required ID, others optional but validated)
export const UpdateCertificateInputSchema =
  CertificateBaseSchema.partial().superRefine((data, ctx) => {
    if (data.issueDate && data.expirationDate) {
      const issue = new Date(data.issueDate);
      const exp = new Date(data.expirationDate);
      if (exp < issue) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["expirationDate"],
          message: "Expiration date must be after issue date",
        });
      }
    }
  });

// Types
export type CreateCertificateInputDTO = z.infer<
  typeof CreateCertificateInputSchema
>;
export type UpdateCertificateInputDTO = z.infer<
  typeof UpdateCertificateInputSchema
>;
