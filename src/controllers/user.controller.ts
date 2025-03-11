import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { PaginatedRequest } from "../middleware/pagination.middleware";
import User from "../models/user.model";
const nodemailer = require("nodemailer");

// Configure email transport
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail
    pass: process.env.EMAIL_PASS, // App password
  },
});

const registerUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, email, password, userType } = req.body;

    if (!["admin", "vendor", "delivery", "normal"].includes(userType)) {
      return res.status(400).json({ error: "Invalid user type" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP

    // Create user with OTP (Not verified yet)
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      userType,
      currentOtp: otp,
      isVerified: false,
    });

    // Send OTP to user's email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify Your Account",
      text: `Your OTP for account verification is: ${otp}`,
    });

    res
      .status(201)
      .json({ message: "User registered! OTP sent for verification." });
  } catch (error) {
    res.status(500).json({ error: "Registration failed!" });
  }
};

const loginUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    if (!user.isVerified) {
      return res.status(403).json({
        error: "User not verified. Please verify your email first.",
        email: user.email,
      });
    }
    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign(
      { id: user.id, userType: user.userType },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "1h",
      }
    );

    return res.json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ error: "Login failed!" });
  }
};

const verifyOtp = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, otp } = req.body;

    // Find user by email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }
    if (user.currentOtp !== otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }
    // Mark user as verified
    user.isVerified = true;
    user.currentOtp = null; // Remove OTP after verification
    await user.save();

    return res.status(200).json({ message: "User verified successfully!" });
  } catch (error) {
    res.status(500).json({ error: "OTP verification failed!" });
  }
};

const resendOtp = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email } = req.body;

    // Find user
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ error: "User is already verified" });
    }

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.currentOtp = otp;
    await user.save();

    // Send new OTP via email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Resend OTP - Verify Your Account",
      text: `Your new OTP is: ${otp}`,
    });

    res.status(200).json({ message: "New OTP sent to your email!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to resend OTP" + error });
  }
};

const getAllProductsList = async (
  req: PaginatedRequest,
  res: Response
): Promise<any> => {
  try {
    res.status(200).json(req.paginatedData);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

export { getAllProductsList, loginUser, registerUser, resendOtp, verifyOtp };
