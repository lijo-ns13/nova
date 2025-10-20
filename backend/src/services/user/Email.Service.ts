import nodemailer, { Transporter } from "nodemailer";
import { injectable } from "inversify";
import { IEmailService } from "../../interfaces/services/IEmailService";

interface EmailContent {
  subject: string;
  body: string;
}

@injectable()
export class EmailService implements IEmailService {
  private transporter: Transporter;

  constructor() {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error(
        "Email credentials (EMAIL_USER or EMAIL_PASS) are missing in environment variables."
      );
    }

    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Verify transporter configuration
    this.transporter.verify((error) => {
      if (error) {
        console.error("Email transporter configuration failed:", error);
      } else {
        console.log("Email transporter is ready.");
      }
    });
  }

  private getEmailStyles(): string {
    return `
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 5px; }
        .header { background: linear-gradient(135deg, #6e48aa 0%, #9d50bb 100%); padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
        .header h1 { color: white; margin: 0; font-family: 'Arial', sans-serif; font-weight: 300; }
        .header p { color: rgba(255,255,255,0.8); margin: 5px 0 0; font-size: 14px; }
        .content { padding: 20px; color: #333; }
        .content h2 { color: #333; }
        .button { background-color: #6e48aa; color: white; padding: 12px 25px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block; }
        .otp-box { background: #f9f9f9; border: 1px dashed #e0e0e0; padding: 15px; text-align: center; margin: 20px 0; font-size: 24px; font-weight: bold; color: #6e48aa; }
        .info-box { background: #f9f9f9; border-left: 4px solid #6e48aa; padding: 15px; margin: 20px 0; }
        .footer { background: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 5px 5px; margin-top: 20px; }
        .footer p { margin: 5px 0; }
        @media only screen and (max-width: 600px) {
          .container { max-width: 100%; }
          .content { padding: 15px; }
          .button { padding: 10px 20px; font-size: 14px; }
        }
      </style>
    `;
  }

  private getEmailHeader(): string {
    return `
      <div class="header">
        <h1><span style="font-weight: 300;">NOVA</span></h1>
        <p>Shining bright in your career journey</p>
      </div>
    `;
  }

  private getEmailFooter(): string {
    return `
      <div class="footer">
        <p>© ${new Date().getFullYear()} Nova. All rights reserved.</p>
        <p>If you didn't request this email, please ignore it.</p>
      </div>
    `;
  }

  private createEmailTemplate(content: EmailContent): string {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        ${this.getEmailStyles()}
      </head>
      <body>
        <div class="container">
          ${this.getEmailHeader()}
          <div class="content">
            ${content.body}
          </div>
          ${this.getEmailFooter()}
        </div>
      </body>
      </html>
    `;
  }

  async sendOTP(email: string, otp: string): Promise<void> {
    try {
      const content: EmailContent = {
        subject: "Your Nova Verification Code",
        body: `
          <h2>Verify Your Account</h2>
          <p>Thank you for choosing Nova! To complete your verification, please use the following One-Time Password (OTP):</p>
          <div class="otp-box">${otp}</div>
          <p>This code will expire in 10 minutes. For security reasons, please do not share this code with anyone.</p>
          <p>If you didn't request this code, please secure your account by changing your password immediately.</p>
        `,
      };

      await this.transporter.sendMail({
        from: `"Nova" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: content.subject,
        html: this.createEmailTemplate(content),
      });
    } catch (error) {
      console.error("Failed to send OTP email:", error);
      throw new Error("Unable to send OTP email.");
    }
  }

  async sendPasswordResetCompanyEmail(
    email: string,
    token: string
  ): Promise<void> {
    try {
      const resetLink = `${process.env.FRONTEND_URL}/company/reset-password?token=${token}`;
      const content: EmailContent = {
        subject: "Nova - Company Password Reset Request",
        body: `
          <h2>Reset Your Company Password</h2>
          <p>We received a request to reset your Nova company account password. Click the button below to proceed:</p>
          <div style="text-align: center; margin: 25px 0;">
            <a href="${resetLink}" class="button">Reset Password</a>
          </div>
          <p>If you didn't request a password reset, please ignore this email or contact our support team if you have concerns.</p>
          <p style="font-size: 12px; color: #999;">Note: This link will expire in 1 hour for security reasons.</p>
        `,
      };

      await this.transporter.sendMail({
        from: `"Nova" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: content.subject,
        html: this.createEmailTemplate(content),
      });
    } catch (error) {
      console.error("Failed to send company password reset email:", error);
      throw new Error("Unable to send company password reset email.");
    }
  }

  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    try {
      const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
      const content: EmailContent = {
        subject: "Nova - Password Reset Request",
        body: `
          <h2>Reset Your Password</h2>
          <p>We received a request to reset your Nova account password. Click the button below to proceed:</p>
          <div style="text-align: center; margin: 25px 0;">
            <a href="${resetLink}" class="button">Reset Password</a>
          </div>
          <p>If you didn't request a password reset, please ignore this email or contact our support team if you have concerns.</p>
          <p style="font-size: 12px; color: #999;">Note: This link will expire in 1 hour for security reasons.</p>
        `,
      };

      await this.transporter.sendMail({
        from: `"Nova" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: content.subject,
        html: this.createEmailTemplate(content),
      });
    } catch (error) {
      console.error("Failed to send password reset email:", error);
      throw new Error("Unable to send password reset email.");
    }
  }

  async sendInterviewLink(
    email: string,
    roomId: string,
    scheduledAt: Date
  ): Promise<void> {
    try {
      const interviewLink = `${process.env.FRONTEND_URL}/interview/${roomId}`;
      const formattedDate = new Intl.DateTimeFormat("en-US", {
        dateStyle: "full",
        timeStyle: "short",
        timeZone: "Asia/Kolkata",
      }).format(scheduledAt);

      const content: EmailContent = {
        subject: "Nova Interview Invitation",
        body: `
          <h2>Interview Invitation</h2>
          <p>Dear Candidate,</p>
          <p>We're excited to invite you for an interview through Nova's platform. Below are your interview details:</p>
          <div class="info-box">
            <p style="margin: 5px 0;"><strong>Date & Time:</strong> ${formattedDate}</p>
            <p style="margin: 5px 0;"><strong>Interview Platform:</strong> Nova Video Interview</p>
          </div>
          <div style="text-align: center; margin: 25px 0;">
            <a href="${interviewLink}" class="button">Join Interview Room</a>
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
        `,
      };

      await this.transporter.sendMail({
        from: `"Nova" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: content.subject,
        html: this.createEmailTemplate(content),
      });
    } catch (error) {
      console.error("Failed to send interview link email:", error);
      throw new Error("Unable to send interview link email.");
    }
  }
}
