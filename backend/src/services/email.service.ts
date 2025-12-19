import nodemailer from "nodemailer";
import { envConfig } from "../configs/env.config";
import { getOTPTemplate } from "../mails/otp.template";

const transporter = nodemailer.createTransport({
  host: envConfig.EMAIL_HOST,
  port: envConfig.EMAIL_PORT,
  secure: false,
  auth: {
    user: envConfig.EMAIL_USER,
    pass: envConfig.EMAIL_PASSWORD,
  },
});

export const sendOTPEmail = async (
  email: string,
  otp: string,
  userName: string
): Promise<void> => {
  const htmlContent = getOTPTemplate({
    userName: userName,
    otp: otp,
    expiryMinutes: envConfig.OTP_EXPIRY_MINUTES || 15,
  });

  const mailOptions = {
    from: envConfig.EMAIL_FROM,
    to: email,
    subject: "Verify your account - Auctionary",
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`OTP email sent to ${email}`);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send verification email");
  }
};

export const sendWelcomeEmail = async (
  email: string,
  userName: string
): Promise<void> => {
  const mailOptions = {
    from: envConfig.EMAIL_FROM,
    to: email,
    subject: "Welcome to Our Platform!",
    html: `
      <!DOCTYPE html>
      <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #667eea;">Welcome ${userName}! 🎉</h1>
          <p>Your email has been successfully verified!</p>
          <p>You can now enjoy all features of our platform.</p>
          <p>Thank you for joining us!</p>
        </div>
      </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
};
