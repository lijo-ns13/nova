import { z } from "zod";
import { ICompany } from "../../../repositories/entities/company.entity";

export const companyResponseSchema = z.object({
  id: z.string(), // _id
  companyName: z.string(),
  username: z.string(),
  email: z.string().email(),
  about: z.string().nullable(),
  industryType: z.string(),
  foundedYear: z.number(),
  website: z.string().nullable(),
  location: z.string(),
  companySize: z.number().nullable(),
  documents: z.array(z.string()),
  isVerified: z.boolean(),
  isBlocked: z.boolean(),
  verificationStatus: z.enum(["pending", "accepted", "rejected"]),
  profilePicture: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export const resendOtpResponseSchema = z.object({
  message: z.string(),
});
export const forgetPasswordSchema = z.object({
  email: z.string().email(),
});
export type ForgetPasswordInputDTO = z.infer<typeof forgetPasswordSchema>;

// Service Output
export const forgetPasswordResponseSchema = z.object({
  rawToken: z.string(),
});
export type ForgetPasswordResponseDTO = z.infer<
  typeof forgetPasswordResponseSchema
>;
export const resetPasswordSchema = z
  .object({
    token: z.string().min(1),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ResetPasswordInputDTO = z.infer<typeof resetPasswordSchema>;
export type ResendOtpResponseDTO = z.infer<typeof resendOtpResponseSchema>;
export type CompanyResponseDTO = z.infer<typeof companyResponseSchema>;

export class CompanyAuthMapper {
  static toDTO(company: ICompany): CompanyResponseDTO {
    return {
      id: company._id.toString(),
      companyName: company.companyName,
      username: company.username,
      email: company.email,
      about: company.about ?? null,
      industryType: company.industryType,
      foundedYear: company.foundedYear,
      website: company.website ?? null,
      location: company.location,
      companySize: company.companySize ?? null,
      documents: company.documents,
      isVerified: company.isVerified,
      isBlocked: company.isBlocked,
      verificationStatus: company.verificationStatus,
      profilePicture: company.profilePicture ?? null,
      createdAt: company.createdAt.toISOString(),
      updatedAt: company.updatedAt.toISOString(),
    };
  }
}
