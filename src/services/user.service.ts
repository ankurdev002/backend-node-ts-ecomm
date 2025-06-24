import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model";
import { sendMail } from "../utils/sendEmail";
import { USER_ROLES, UserRole } from "../constants/user_roles";

export const registerNewUser = async (
  name: string,
  email: string,
  password: string,
  userType: UserRole
) => {
  if (!Object.values(USER_ROLES).includes(userType)) {
    throw new Error("Invalid user type");
  }

  // Check if user already exists
  const existingUser = await User.findOne({ where: { email } });

  // Case 1: User exists and is already verified
  if (existingUser?.isVerified) {
    throw new Error("Email already registered");
  }

  // OTP for verification
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP

  if (existingUser && !existingUser.isVerified) {
    await sendMail(email, "verify", otp);
    return { message: "OTP re-sent for verification." };
  }

  // Case 3: New user - hash password and create user
  const hashedPassword = await bcrypt.hash(password, 10);
  await User.create({
    name,
    email,
    password: hashedPassword,
    userType,
    currentOtp: otp,
    isVerified: false,
  });

  await sendMail(email, "verify", otp);

  return { message: "User registered! OTP sent for verification." };
};

export const login = async (email: string, password: string) => {
  const user = await User.findOne({ where: { email } });
  // user not exist
  if (!user) throw new Error("No user found");
  // unverified user
  if (!user.isVerified) return { unverified: true, email: user.email };
  //credenetial invalid
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  const token = jwt.sign(
    { id: user.id, userType: user.userType },
    process.env.JWT_SECRET!,
    {
      expiresIn: "1h",
    }
  );

  return { message: "Login successful", token };
};

export const verifyUserOtp = async (email: string, otp: string) => {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error("User not found");
  if (user.currentOtp !== otp) throw new Error("Invalid OTP");

  user.isVerified = true;
  user.currentOtp = null;
  await user.save();

  return { message: "User verified successfully!" };
};

export const resendUserOtp = async (email: string) => {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error("User not found");
//   if (user.isVerified) throw new Error("User is already verified");

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.currentOtp = otp;
  await user.save();

  await sendMail(email, "verify", otp);
  return { message: "New OTP sent to your email!" };
};
