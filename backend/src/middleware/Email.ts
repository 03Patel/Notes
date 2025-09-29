// EmailService.ts
import { transporter } from "../middleware/Email.config";
import {
  Verification_Email_Template,
  Welcome_Email_Template,
} from "../middleware/EmailTemplate";
import type { SentMessageInfo } from "nodemailer";

export const sendVerificationEmail = async (
  email: string,
  verificationCode: string
): Promise<void> => {
  try {
    const response: SentMessageInfo = await transporter.sendMail({
      from: '"Ganesh" <ganeshjipatel108@gmail.com>',
      to: email,
      subject: "Verify your Email",
      text: "Verify your Email",
      // CALL the template function (not .replace)
      html: Verification_Email_Template(verificationCode),
    });

    console.log("Verification Email sent successfully:", response);
  } catch (error) {
    console.error("Verification Email error:", error);
  }
};

export const sendWelcomeEmail = async (
  email: string,
  name: string
): Promise<void> => {
  try {
    const response: SentMessageInfo = await transporter.sendMail({
      from: '"Ganesh" <bit21cs51@bit.ac.in>',
      to: email,
      subject: "Welcome Email",
      text: "Welcome Email",
      // CALL the template function (not .replace)
      html: Welcome_Email_Template(name),
    });

    console.log("Welcome Email sent successfully:", response);
  } catch (error) {
    console.error("Welcome Email error:", error);
  }
};
