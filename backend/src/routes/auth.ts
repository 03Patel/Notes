import express, { Request, Response } from "express";
import { Usermodel, IUser } from "../models/User";
import { sendVerificationEmail, sendWelcomeEmail } from "../middleware/Email";
import { generateTokenAndSetCookies } from "../middleware/GenerateToken";

const router = express.Router();

// Signup
router.post("/signup", async (req: Request, res: Response) => {
  try {
    const { email, name } = req.body;

    if (!email || !name) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existsUser = await Usermodel.findOne({ email });
    if (existsUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

    const user = new Usermodel({
      email,
      name,
      verificationToken,
      verificationTokenExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    await user.save();
    const u = user.id.toString()

    generateTokenAndSetCookies(res, u);
    await sendVerificationEmail(user.email, verificationToken);

    return res.status(200).json({
      message: "User Registered Successfully",
      user: { _id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Verify Email
router.post("/verifyEmail", async (req: Request, res: Response) => {
  try {
    const { code } = req.body;

    const user = await Usermodel.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or Expired Code" });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();

    await sendWelcomeEmail(user.email, user.name || "");

    return res.status(200).json({ message: "Email Verified Successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Request OTP for login
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    let user = await Usermodel.findOne({ email });
     if (!user) {
      return res.status(400).json({ message: "User not registered. Please sign up first." });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.verificationToken = otp;
    user.verificationTokenExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await sendVerificationEmail(email, otp);

    return res.status(200).json({ message: "OTP sent to your email" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Verify OTP
router.post("/login-verify-otp", async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: "Email and OTP required" });

    const user = await Usermodel.findOne({
      email,
      verificationToken: otp,
      verificationTokenExpiresAt: { $gt: new Date() },
    });

    if (!user) return res.status(400).json({ message: "Invalid or expired OTP" });

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();
    const u = user.id.toString()
    const token = generateTokenAndSetCookies(res, u);

    return res.status(200).json({
      message: "Login successful",
      token,
      user: { _id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
