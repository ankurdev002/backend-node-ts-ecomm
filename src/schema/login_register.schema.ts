// schemas/user.schema.ts
import { z } from "zod";
import { USER_ROLES } from "../constants/user_roles";


//register user validation
export const registerUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(5),
  userType: z.enum([
    USER_ROLES.ADMIN,
    USER_ROLES.VENDOR,
    USER_ROLES.DELIVERY,
    USER_ROLES.NORMAL,
  ]),
});

//login user
export const loginUserSchema = z.object({
  email: z.string().email({ message: "Valid email required" }),
  password: z.string().min(5, { message: "Password min 5 chars" }),
});

//verify otp
export const verifyOtpSchema = z.object({
  email: z.string().email({ message: "Valid email required" }),
  otp: z
    .string()
    .length(6, { message: "OTP must be 6 digits" }),
});

//resend otp
export const resendOtpSchema = z.object({
  email: z.string().email({ message: "Valid email required" }),
});

export type RegisterUserDTO = z.infer<typeof registerUserSchema>;
export type LoginUserDTO = z.infer<typeof loginUserSchema>;
export type VerifyOtpDTO = z.infer<typeof verifyOtpSchema>;
export type ResendOtpDTO = z.infer<typeof resendOtpSchema>;