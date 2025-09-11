import { z } from "zod";
import { IndustryTypes } from "../../../constants/industrytypes";

// Base company schema
const CompanyBaseSchema = z.object({
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username cannot exceed 20 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    ),
  about: z.string().optional(),
  industryType: z.enum([...IndustryTypes] as [string, ...string[]]),
  foundedYear: z
    .number()
    .int()
    .min(1900, "Invalid founding year")
    .max(new Date().getFullYear(), "Founding year cannot be in the future"),
  website: z.string().url("Invalid website URL").optional(),
  location: z.string().min(2, "Location must be at least 2 characters"),
  companySize: z
    .number()
    .int()
    .positive("Company size must be positive")
    .optional(),
});

// Profile update schema (all fields optional)
export const UpdateProfileSchema = CompanyBaseSchema.partial();

// Change password schema
export const ChangePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(6, "Current password must be at least 6 characters"),
    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// Profile image schema
export const ProfileImageSchema = z.object({
  imageUrl: z.string().url("Invalid image URL"),
});

export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>;
export type ProfileImageInput = z.infer<typeof ProfileImageSchema>;
