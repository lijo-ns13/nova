import nodemailer from "nodemailer";

export const sendPasswordResetEmail = async (
  email: string,
  token: string
): Promise<void> => {
  const resetURL = `http://localhost:5173/reset-password?token=${token}`;

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for 587
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER!,
      pass: process.env.EMAIL_PASS!,
    },
  });

  const mailOptions = {
    from: '"Brix platform" <no-reply@brix.com>',
    to: email,
    subject: "Reset Your Password - Brix Platform",
    text: `You requested a password reset. Click the link below to reset your password:\n\n${resetURL}\n\nIf you did not request this, please ignore this email.`,
    html: `
      <p>Hello,</p>
      <p>You requested a password reset. Click the link below to reset your password:</p>
      <p><a href="${resetURL}" style="color: #1a73e8;">Reset Password</a></p>
      <p>If you did not request this, please ignore this email.</p>
      <br />
      <p>Regards,<br />Brix Team</p>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Password reset email sent:", info.messageId);
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw new Error("Failed to send password reset email");
  }
};
