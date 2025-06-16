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

  private getEmailHeader(): string {
    return `
      <div style="background: linear-gradient(135deg, #6e48aa 0%, #9d50bb 100%); padding: 20px; text-align: center; border-radius: 5px 5px 0 0;">
        <h1 style="color: white; margin: 0; font-family: 'Arial', sans-serif;">
          <span style="font-weight: 300;">NOVA</span>
        </h1>
        <p style="color: rgba(255,255,255,0.8); margin: 5px 0 0; font-size: 14px;">Shining bright in your career journey</p>
      </div>
    `;
  }

  private getEmailFooter(): string {
    return `
      <div style="background: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 5px 5px; margin-top: 20px;">
        <p style="margin: 5px 0;">© ${new Date().getFullYear()} Nova. All rights reserved.</p>
        <p style="margin: 5px 0;">If you didn't request this email, please ignore it.</p>
      </div>
    `;
  }

  async sendOTP(email: string, otp: string): Promise<void> {
    console.log("EMAIL_USER:", process.env.EMAIL_USER);
    console.log(
      "EMAIL_PASSWORD:",
      process.env.EMAIL_PASS ? "✅ Exists" : "❌ Missing"
    );

    await this.transporter.sendMail({
      from: `"Nova" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your Nova Verification Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 5px;">
          ${this.getEmailHeader()}
          <div style="padding: 20px;">
            <h2 style="color: #333;">Verify Your Account</h2>
            <p>Thank you for choosing Nova! To complete your verification, please use the following One-Time Password (OTP):</p>
            
            <div style="background: #f9f9f9; border: 1px dashed #e0e0e0; padding: 15px; text-align: center; margin: 20px 0; font-size: 24px; font-weight: bold; color: #6e48aa;">
              ${otp}
            </div>
            
            <p>This code will expire in 10 minutes. For security reasons, please do not share this code with anyone.</p>
            <p>If you didn't request this code, please secure your account by changing your password immediately.</p>
          </div>
          ${this.getEmailFooter()}
        </div>
      `,
    });
  }

  async sendPasswordResetCompanyEmail(
    email: string,
    token: string
  ): Promise<void> {
    const resetLink = `${process.env.FRONTEND_URL}/company/reset-password?token=${token}`;
    await this.transporter.sendMail({
      from: `"Nova" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Nova - Company Password Reset Request",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 5px;">
          ${this.getEmailHeader()}
          <div style="padding: 20px;">
            <h2 style="color: #333;">Reset Your Company Password</h2>
            <p>We received a request to reset your Nova company account password. Click the button below to proceed:</p>
            
            <div style="text-align: center; margin: 25px 0;">
              <a href="${resetLink}" style="background-color: #6e48aa; color: white; padding: 12px 25px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Reset Password</a>
            </div>
            
            <p>If you didn't request a password reset, please ignore this email or contact our support team if you have concerns.</p>
            <p style="font-size: 12px; color: #999;">Note: This link will expire in 1 hour for security reasons.</p>
          </div>
          ${this.getEmailFooter()}
        </div>
      `,
    });
  }

  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    await this.transporter.sendMail({
      from: `"Nova" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Nova - Password Reset Request",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 5px;">
          ${this.getEmailHeader()}
          <div style="padding: 20px;">
            <h2 style="color: #333;">Reset Your Password</h2>
            <p>We received a request to reset your Nova account password. Click the button below to proceed:</p>
            
            <div style="text-align: center; margin: 25px 0;">
              <a href="${resetLink}" style="background-color: #6e48aa; color: white; padding: 12px 25px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Reset Password</a>
            </div>
            
            <p>If you didn't request a password reset, please ignore this email or contact our support team if you have concerns.</p>
            <p style="font-size: 12px; color: #999;">Note: This link will expire in 1 hour for security reasons.</p>
          </div>
          ${this.getEmailFooter()}
        </div>
      `,
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
      timeZone: "Asia/Kolkata",
    }).format(scheduledAt);

    await this.transporter.sendMail({
      from: `"Nova" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Nova Interview Invitation",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 5px;">
          ${this.getEmailHeader()}
          <div style="padding: 20px;">
            <h2 style="color: #333;">Interview Invitation</h2>
            <p>Dear Candidate,</p>
            
            <p>We're excited to invite you for an interview through Nova's platform. Below are your interview details:</p>
            
            <div style="background: #f9f9f9; border-left: 4px solid #6e48aa; padding: 15px; margin: 20px 0;">
              <p style="margin: 5px 0;"><strong>Date & Time:</strong> ${formattedDate}</p>
              <p style="margin: 5px 0;"><strong>Interview Platform:</strong> Nova Video Interview</p>
            </div>
            
            <div style="text-align: center; margin: 25px 0;">
              <a href="${interviewLink}" style="background-color: #6e48aa; color: white; padding: 12px 25px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Join Interview Room</a>
            </div>
            
            <p><strong>Preparation Tips:</strong></p>
            <ul>
              <li>Test your camera and microphone beforehand</li>
              <li>Join 5 minutes early to ensure everything works</li>
              <li>Find a quiet, well-lit space for the interview</li>
              <li>Have your resume and any relevant materials ready</li>
            </ul>
            
            <p>If you have any technical difficulties or need to reschedule, please contact us immediately.</p>
            
            <p>We look forward to meeting you!</p>
          </div>
          ${this.getEmailFooter()}
        </div>
      `,
    });
  }
}
