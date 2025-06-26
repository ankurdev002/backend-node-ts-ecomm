import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { PaginatedRequest, AuthenticatedRequest } from "../types/common.type";
import User from "../models/user.model";
import { sendMail } from "../utils/sendEmail";
import { validationResult } from "express-validator";
import { USER_ROLES } from "../constants/user_roles";
import {
  login,
  registerNewUser,
  resendUserOtp,
  verifyUserOtp,
  getUserProfile,
  updateUserProfile,
} from "../services/user.service";

const registerUser = async (req: Request, res: Response): Promise<any> => {
  // const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //   return res.status(400).json({ errors: errors.array() });
  // }
  const { name, email, password, userType } = req.body;
  try {
    const result = await registerNewUser(name, email, password, userType);
    res.status(201).json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

const loginUser = async (req: Request, res: Response): Promise<any> => {
  const { email, password } = req.body;

  try {
    const result = await login(email, password);
    if ((result as any).unverified) {
      return res.status(403).json({
        error: "User not verified. Please verify your email first.",
        email: (result as any).email,
      });
    }
    res.json(result);
  } catch (err: any) {
    res.status(401).json({ error: err.message });
  }
};

const verifyOtp = async (req: Request, res: Response): Promise<any> => {
  const { email, otp } = req.body;
  try {
    const result = await verifyUserOtp(email, otp);
    res.status(200).json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

const resendOtp = async (req: Request, res: Response): Promise<any> => {
  const { email } = req.body;
  try {
    const result = await resendUserOtp(email);
    res.status(200).json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
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

const getProfile = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const user = await getUserProfile(userId);

    res.json({
      success: true,
      message: "Profile retrieved successfully",
      data: user,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateProfile = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const updatedUser = await updateUserProfile(userId, req.body);

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export {
  getAllProductsList,
  loginUser,
  registerUser,
  resendOtp,
  verifyOtp,
  getProfile,
  updateProfile,
};
