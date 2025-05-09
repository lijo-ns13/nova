// src/core/interfaces/services/IEmailService.ts
export interface IEmailService {
  sendOTP(email: string, otp: string): Promise<void>;
  sendPasswordResetEmail(email: string, token: string): Promise<void>;
}
