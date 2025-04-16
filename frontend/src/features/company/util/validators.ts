import { z } from "zod";
import { IndustryTypes } from "../../../constants/industryTypes";

export const signUpCompanyRequestSchema = z
  .object({
    companyName: z
      .string()
      .min(3, { message: "Company name must be at least 3 characters long" })
      .regex(/^[A-Za-z ]+$/, {
        message: "Company name can only contain letters and spaces",
      }),

    email: z.string().email({ message: "Invalid email format" }),

    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long" })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter",
      })
      .regex(/[0-9]/, { message: "Password must contain at least one number" }),

    confirmPassword: z.string(),

    about: z
      .string()
      .min(10, { message: "Description must be at least 10 characters long" }),

    businessNumber: z.number({
      invalid_type_error: "Business number must be a number",
    }),

    industryType: z.string().refine((val) => IndustryTypes.includes(val), {
      message: "Invalid industry type selected",
    }),

    foundedYear: z
      .number({ invalid_type_error: "Founded year must be a number" })
      .min(1800, { message: "Founded year must be after 1800" })
      .max(new Date().getFullYear(), {
        message: "Founded year cannot be in the future",
      }),

    documents: z
      .array(z.string().url())
      .min(1, { message: "At least one document is required" }),

    location: z
      .string()
      .min(3, { message: "Location must be at least 3 characters long" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });
