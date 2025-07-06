// src/shared/email/templates/verificationEmailBuilder.ts

export function buildCompanyVerificationEmail(
  status: "accepted" | "rejected",
  companyName: string,
  rejectionReason?: string
): { subject: string; text: string; html: string } {
  if (status === "accepted") {
    return {
      subject: "🎉 Your Company Has Been Verified!",
      text: `Dear ${companyName},\n\nCongratulations! Your company has been verified on Brix. You can now enjoy full access to post jobs and manage candidates.\n\nWelcome aboard!\n\nBrix Team`,
      html: `
        <h2>Dear ${companyName},</h2>
        <p>🎉 Congratulations! Your company has been <strong>verified</strong> on Brix.</p>
        <p>You now have full access to post jobs and manage candidates.</p>
        <br/>
        <p>Welcome aboard!</p>
        <p>Regards,<br/>Nova Team</p>
      `,
    };
  } else {
    return {
      subject: "❌ Company Verification Rejected",
      text: `Dear ${companyName},\n\nWe regret to inform you that your company verification request has been rejected after review.\n\nIf you have any questions, contact support.\n\nRegards,\nBrix Team`,
      html: `
        <h2>Dear ${companyName},</h2>
        <p>❌ We regret to inform you that your company verification has been <strong>rejected</strong>.</p>
        <p><strong>Reason:</strong> ${rejectionReason}</p>
        <p>You can do the same process again with proper documents and data.</p>
        <br/>
        <p>Regards,<br/>Nova Team</p>
      `,
    };
  }
}
