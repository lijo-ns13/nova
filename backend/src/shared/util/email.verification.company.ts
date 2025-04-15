import nodemailer from "nodemailer";

export const sendVerificationCompanyEmail = async (
  to: string,
  subject: string,
  text: string,
  html?: string
): Promise<void> => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER!,
      pass: process.env.EMAIL_PASS!,
    },
  });

  const mailOptions = {
    from: '"Brix Platform" <no-reply@yourapp.com>',
    to,
    subject,
    text,
    html: html || text, // if no html provided, fallback to text
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${to}:`, info.messageId);
  } catch (error) {
    console.error(`❌ Error sending email to ${to}:`, error);
    throw new Error("Failed to send verification email");
  }
};
