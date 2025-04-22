import nodemailer from 'nodemailer';

export const sendOTPEmail = async (to: string, otp: string): Promise<void> => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465, // or use 587 for TLS (with secure: false)
        secure: true, // true for 465, false for 587
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER!,
            pass: process.env.EMAIL_PASS!
        }
    });
      

  const mailOptions = {
    from: '"Brix platform" <no-reply@yourapp.com>',
    to,
    subject: 'Your OTP Code For Email Verification',
    text: `Your OTP code is: ${otp}. It will expire in 10 minutes.`,
    html: `<p>Your OTP code is: <strong>${otp}</strong></p><p>This code will expire in 10 minutes.</p>`
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('OTP email sent:', info.messageId);
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw new Error('Failed to send OTP email');
  }
};
