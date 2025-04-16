import { z } from "zod";
export interface SignInCompanyResponseDTO {
  accessToken: string;
  refreshToken: string;
  company: object;
  isVerified: boolean;
  isBlocked: boolean;
}
export const signInCompanyRequestSchema = z.object({
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
});

export type SignInCompanyRequestDTO = z.infer<
  typeof signInCompanyRequestSchema
>;
