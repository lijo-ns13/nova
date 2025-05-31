// src/infrastructure/services/EmailService.ts
import nodemailer from "nodemailer";
import { injectable } from "inversify";
import { IEmailService } from "../../interfaces/services/IEmailService";

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
  // async sendPasswordResetCompanyEmail(email: string, token: string): Promise<void> {
  //     const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
  //     await this.transporter.sendMail({
  //       from: `"Your App Name" <${process.env.EMAIL_USER}>`,
  //       to: email,
  //       subject: "Password Reset Request",
  //       html: `<p>Click <a href="${resetLink}">here</a> to reset your password</p>`,
  //     });
  //   }
  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    await this.transporter.sendMail({
      from: `"Your App Name" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset Request",
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password</p>`,
    });
  }
  async sendInterviewLink(
    email: string,
    roomId: string,
    scheduledAt: Date
  ): Promise<void> {
    const interviewLink = `${process.env.FRONTEND_URL}/interview/${roomId}`;
    const formattedDate = new Intl.DateTimeFormat("en-US", {
      dateStyle: "full",
      timeStyle: "short",
      timeZone: "Asia/Kolkata", // You can customize the time zone
    }).format(scheduledAt);

    await this.transporter.sendMail({
      from: `"Your App Name" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Interview Invitation – Scheduled Details Inside",
      html: `
      <p>Dear Candidate,</p>

      <p>We are pleased to inform you that your interview has been scheduled. Please find the details below:</p>

      <ul>
        <li><strong>Date & Time:</strong> ${formattedDate}</li>
        <li><strong>Interview Room:</strong> <a href="${interviewLink}">Join Here</a></li>
      </ul>

      <p>Please ensure you are online and ready to join the interview a few minutes before the scheduled time.</p>

      <p>If you have any questions, feel free to reach out.</p>

      <p>Best regards,<br>Your App Name Team</p>
    `,
    });
  }
}
