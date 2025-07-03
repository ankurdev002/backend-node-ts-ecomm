// schemas/user.schema.ts
import { z } from "zod";
import { USER_ROLES } from "../constants/user_roles";

//register user validation
export const registerUserSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(5),
    userType: z.enum([
      USER_ROLES.ADMIN,
      USER_ROLES.VENDOR,
      USER_ROLES.DELIVERY,
      USER_ROLES.NORMAL,
    ]),
  }),
});

//login user
export const loginUserSchema = z.object({
  body: z.object({
    email: z.string().email({ message: "Valid email required" }),
    password: z.string().min(5, { message: "Password min 5 chars" }),
  }),
});

//verify otp
export const verifyOtpSchema = z.object({
  body: z.object({
    email: z.string().email({ message: "Valid email required" }),
    otp: z.string().length(6, { message: "OTP must be 6 digits" }),
  }),
});

//resend otp
export const resendOtpSchema = z.object({
  body: z.object({
    email: z.string().email({ message: "Valid email required" }),
  }),
});

// Update profile schema
export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required").optional(),
    phone: z
      .string()
      .regex(/^[\+]?[1-9][\d]{0,15}$/, "Invalid phone number format")
      .optional(),
    dateOfBirth: z
      .string()
      .datetime({ message: "Invalid date format" })
      .optional(),
    gender: z.enum(["male", "female", "other"]).optional(),
  }),
});

// Get all products list query schema
export const getAllProductsListSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/, "Page must be a number").optional(),
    limit: z.string().regex(/^\d+$/, "Limit must be a number").optional(),
    search: z.string().optional(),
    category: z.string().optional(),
    sortBy: z.enum(["name", "price", "createdAt"]).optional(),
    sortOrder: z.enum(["ASC", "DESC"]).optional(),
  }),
});

export type RegisterUserDTO = z.infer<typeof registerUserSchema>;
export type LoginUserDTO = z.infer<typeof loginUserSchema>;
export type VerifyOtpDTO = z.infer<typeof verifyOtpSchema>;
export type ResendOtpDTO = z.infer<typeof resendOtpSchema>;
export type UpdateProfileDTO = z.infer<typeof updateProfileSchema>;
export type GetAllProductsListDTO = z.infer<typeof getAllProductsListSchema>;
