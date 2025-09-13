import { z } from "zod";

export const verifyRequestSchema = z.object({
  email: z.string().email({ message: "Invalid email format" }),
  otp: z
    .string()
    .trim()
    .length(6, { message: "OTP must be 6 characters long" }),
});

export const resendRequestSchema = z.object({
  email: z.string().email({ message: "Invalid email format" }),
});

export const forgetRequestSchema = z.object({
  email: z.string().email({ message: "Invalid email format" }),
});

export const resetRequestSchema = z
  .object({
    token: z.string().min(1, { message: "Token is required" }),
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
    confirmPassword: z
      .string()
      .min(6, {
        message: "Confirm password must be at least 6 characters long",
      })
      .regex(/[A-Z]/, {
        message: "Confirm password must contain at least one uppercase letter",
      })
      .regex(/[a-z]/, {
        message: "Confirm password must contain at least one lowercase letter",
      })
      .regex(/[0-9]/, {
        message: "Confirm password must contain at least one number",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type VerifyDTO = z.infer<typeof verifyRequestSchema>;
export type ResendDTO = z.infer<typeof resendRequestSchema>;
export type ForgetDTO = z.infer<typeof forgetRequestSchema>;
export type ResetDTO = z.infer<typeof resetRequestSchema>;
