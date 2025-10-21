import { z } from "zod";
import { Types } from "mongoose";

// ✅ Basic DTO returned to frontend
export const CompanyProfileDTO = z.object({
  id: z.string(),
  companyName: z.string(),
  username: z.string(),
  about: z.string().nullable(),
  email: z.string().email(),
  industryType: z.string().nullable(),
  foundedYear: z.number().nullable(),
  website: z.string().nullable(),
  location: z.string().nullable(),
  companySize: z.number().nullable(),
  isVerified: z.boolean(),
  verificationStatus: z.enum(["pending", "accepted", "rejected"]),
  isBlocked: z.boolean(),
  profilePicture: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type CompanyProfileDTO = z.infer<typeof CompanyProfileDTO>;

// ✅ DTO for profile update input
export const UpdateCompanyProfileInput = z.object({
  companyName: z.string().optional(),
  username: z.string().optional(),
  about: z.string().optional(),
  industryType: z.string().optional(),
  foundedYear: z.number().optional(),
  website: z.string().optional(),
  location: z.string().optional(),
  companySize: z.number().optional(),
});

export type UpdateCompanyProfileInputType = z.infer<
  typeof UpdateCompanyProfileInput
>;
