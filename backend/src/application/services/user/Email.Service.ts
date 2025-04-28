// src/infrastructure/services/EmailService.ts
import nodemailer from "nodemailer";
import { injectable } from "inversify";
import { IEmailService } from "../../../core/interfaces/services/IEmailService";

@injectable()
export class EmailService implements IEmailService {
  private transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  async sendOTP(email: string, otp: string): Promise<void> {
    console.log("EMAIL_USER:", process.env.EMAIL_USER);
    console.log(
      "EMAIL_PASSWORD:",
      process.env.EMAIL_PASS ? "✅ Exists" : "❌ Missing"
    );

    await this.transporter.sendMail({
      from: `"Your App Name" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your Verification OTP",
      html: `<p>Your OTP code is: <strong>${otp}</strong></p>`,
    });
  }

  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${token}`;
    await this.transporter.sendMail({
      from: `"Your App Name" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset Request",
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password</p>`,
    });
  }
}
