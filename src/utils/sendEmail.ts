const nodemailer = require("nodemailer");

// Configure email transport
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail
    pass: process.env.EMAIL_PASS, // App password
  },
});
interface MailOptions {
  subject: string;
  text?: string;
  html?: string;
}

const getMailOptions = (
  type: string,
  email: string,
  otp: string
): MailOptions => {
  switch (type) {
    case "verify":
      return {
        subject: "Verify Your Account",
        html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 30px auto; padding: 30px; border-radius: 12px; background: linear-gradient(145deg, #ffffff, #f0f0f0); box-shadow: 0 4px 12px rgba(0,0,0,0.1); border: 1px solid #e0e0e0;">
              <div style="text-align: center; margin-bottom: 20px;">
                <h2 style="color: #4CAF50; margin-bottom: 5px;">🔐 Verify Your Account</h2>
                <p style="color: #666; font-size: 15px;">Secure your account with this verification code</p>
              </div>

              <p style="font-size: 16px; color: #333;">Hi <strong>${email}</strong>,</p>
              <p style="font-size: 15px; color: #555; line-height: 1.6;">
                Thanks for joining us! Use the code below to verify your account and get started:
              </p>

              <div style="text-align: center; margin: 30px 0;">
                <div style="display: inline-block; background: #4CAF50; color: white; font-size: 26px; letter-spacing: 8px; padding: 15px 30px; border-radius: 10px; font-weight: bold; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
                  ${otp}
                </div>
              </div>

              <p style="font-size: 14px; color: #888;">This code will expire in 10 minutes.</p>
              <p style="font-size: 14px; color: #888;">If you didn’t request this code, you can safely ignore this email.</p>

              <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;" />

              <div style="text-align: center; font-size: 12px; color: #aaa;">
                &copy; ${new Date().getFullYear()} Your Company. All rights reserved.
              </div>
            </div>
        `,
      };
    case "reset":
      return {
        subject: "Reset Your Password",
        text: `Use the following OTP to reset your password: ${otp}`,
      };
    case "welcome":
      return {
        subject: "Welcome to Our Platform!",
        text: `Welcome, ${email}! We're excited to have you on board.`,
      };
    default:
      throw new Error("Invalid email type");
  }
};

export const sendMail = async (email: string, type: string, otp: string) => {
  const mailOptions = getMailOptions(type, email, otp);

  return await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: mailOptions.subject,
    text: mailOptions.text,
    html: mailOptions.html,
  });
};
