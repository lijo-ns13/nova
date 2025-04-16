import { ObjectId } from "mongoose";
import { z } from "zod";

export interface SignUpCompanyResponseDTO {
  id?: string | ObjectId;
  companyName?: string;
  email?: string;
  description?: string;
  bussinessNumber?: number;
  industryType?: string;
  foundedYear?: number;
  documents?: string[];
  verificationStatus?: "pending" | "accepted" | "rejected";
  isVerified?: boolean;
  location?: string;
}

const industryTypes = [
  "Information Technology",
  "Software Development",
  "E-Commerce",
  "Banking & Financial Services",
  "Healthcare",
  "Pharmaceutical",
  "Telecommunications",
  "Education & Training",
  "Manufacturing",
  "Automotive",
  "Construction",
  "Retail",
  "Logistics & Supply Chain",
  "Media & Entertainment",
  "Hospitality",
  "Real Estate",
  "Legal Services",
  "Agriculture",
  "Energy & Utilities",
  "Non-Profit / NGO",
  "Government / Public Administration",
  "Consulting",
  "Human Resources",
  "Marketing & Advertising",
  "Insurance",
  "Aviation / Aerospace",
  "Chemicals",
  "Fashion & Apparel",
  "Mining & Metals",
  "Sports & Fitness",
  "Food & Beverage",
  "Maritime",
  "Defense & Security",
  "Electronics / Electrical",
  "Environmental Services",
  "Research & Development",
  "Arts & Culture",
];

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
      .min(10, { message: "About must be at least 10 characters long" })
      .optional(),

    businessNumber: z
      .number({ invalid_type_error: "Business number must be a number" })
      .min(1, { message: "Business number must be a positive number" })
      .max(9999999999, { message: "Business number is too long" }),

    industryType: z.string().refine((val) => industryTypes.includes(val), {
      message: "Invalid industry type selected",
    }),

    foundedYear: z
      .number({ invalid_type_error: "Founded year must be a number" })
      .min(1800, { message: "Founded year must be after 1800" })
      .max(new Date().getFullYear(), {
        message: "Founded year cannot be in the future",
      }),

    documents: z
      .array(
        z
          .string()
          .regex(/^https?:\/\/\S+$/, { message: "Invalid document URL" })
      )
      .min(1, { message: "At least one document is required" })
      .max(10, { message: "You can upload a maximum of 10 documents" }),

    location: z
      .string()
      .min(3, { message: "Location must be at least 3 characters long" })
      .optional(),
  })
  .refine((data) => data.password !== data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });
export type SignUpCompanyRequestDTO = z.infer<
  typeof signUpCompanyRequestSchema
>;
