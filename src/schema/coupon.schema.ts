import { z } from "zod";

// Schema for creating a coupon (Admin only)
export const createCouponSchema = z
  .object({
    code: z
      .string()
      .min(3, "Coupon code must be at least 3 characters")
      .max(50, "Coupon code must be less than 50 characters")
      .regex(
        /^[A-Z0-9_-]+$/,
        "Coupon code must contain only uppercase letters, numbers, underscores, and hyphens"
      ),
    name: z
      .string()
      .min(3, "Coupon name must be at least 3 characters")
      .max(255, "Coupon name must be less than 255 characters"),
    description: z
      .string()
      .max(500, "Description must be less than 500 characters")
      .optional(),
    type: z.enum(["percentage", "fixed"], {
      required_error: "Coupon type is required",
      invalid_type_error: "Coupon type must be 'percentage' or 'fixed'",
    }),
    value: z
      .number()
      .positive("Coupon value must be positive")
      .refine((val) => val <= 100, "Percentage value cannot exceed 100%")
      .optional(),
    minOrderAmount: z
      .number()
      .min(0, "Minimum order amount cannot be negative")
      .default(0),
    maxDiscountAmount: z
      .number()
      .positive("Maximum discount amount must be positive")
      .optional(),
    usageLimit: z
      .number()
      .int()
      .min(1, "Usage limit must be at least 1")
      .default(1),
    userLimit: z
      .number()
      .int()
      .min(1, "User limit must be at least 1")
      .default(1),
    validFrom: z
      .string()
      .datetime({ message: "Invalid valid from date format" }),
    validUntil: z
      .string()
      .datetime({ message: "Invalid valid until date format" }),
    applicableProducts: z.array(z.number().int().positive()).optional(),
    applicableCategories: z.array(z.number().int().positive()).optional(),
  })
  .refine(
    (data) => {
      // Custom validation for percentage type
      if (data.type === "percentage" && data.value && data.value > 100) {
        return false;
      }
      return true;
    },
    {
      message: "Percentage value cannot exceed 100%",
      path: ["value"],
    }
  )
  .refine(
    (data) => {
      // Ensure valid from is before valid until
      const validFrom = new Date(data.validFrom);
      const validUntil = new Date(data.validUntil);
      return validFrom < validUntil;
    },
    {
      message: "Valid from date must be before valid until date",
      path: ["validUntil"],
    }
  );

// Schema for updating a coupon (Admin only)
export const updateCouponSchema = z.object({
  name: z
    .string()
    .min(3, "Coupon name must be at least 3 characters")
    .max(255, "Coupon name must be less than 255 characters")
    .optional(),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional(),
  value: z.number().positive("Coupon value must be positive").optional(),
  minOrderAmount: z
    .number()
    .min(0, "Minimum order amount cannot be negative")
    .optional(),
  maxDiscountAmount: z
    .number()
    .positive("Maximum discount amount must be positive")
    .optional(),
  usageLimit: z
    .number()
    .int()
    .min(1, "Usage limit must be at least 1")
    .optional(),
  userLimit: z
    .number()
    .int()
    .min(1, "User limit must be at least 1")
    .optional(),
  validFrom: z
    .string()
    .datetime({ message: "Invalid valid from date format" })
    .optional(),
  validUntil: z
    .string()
    .datetime({ message: "Invalid valid until date format" })
    .optional(),
  isActive: z.boolean().optional(),
  applicableProducts: z.array(z.number().int().positive()).optional(),
  applicableCategories: z.array(z.number().int().positive()).optional(),
});

// Schema for validating a coupon code
export const validateCouponSchema = z.object({
  code: z
    .string()
    .min(3, "Coupon code must be at least 3 characters")
    .max(50, "Coupon code must be less than 50 characters"),
  orderAmount: z.number().positive("Order amount must be positive"),
  productIds: z.array(z.number().int().positive()).optional(),
});

// Schema for applying a coupon
export const applyCouponSchema = z.object({
  code: z
    .string()
    .min(3, "Coupon code must be at least 3 characters")
    .max(50, "Coupon code must be less than 50 characters"),
  orderId: z.number().int().positive("Order ID must be a positive integer"),
});

// Schema for getting coupon by ID
export const getCouponSchema = z.object({
  couponId: z.string().regex(/^\d+$/, "Coupon ID must be a number"),
});

// Schema for getting coupons with pagination
export const getCouponsSchema = z.object({
  page: z.string().regex(/^\d+$/, "Page must be a number").optional(),
  limit: z.string().regex(/^\d+$/, "Limit must be a number").optional(),
  isActive: z.enum(["true", "false"]).optional(),
  type: z.enum(["percentage", "fixed"]).optional(),
});

// Schema for getting coupon by code
export const getCouponByCodeSchema = z.object({
  code: z.string().min(3, "Coupon code must be at least 3 characters"),
});

export type CreateCouponInput = z.infer<typeof createCouponSchema>;
export type UpdateCouponInput = z.infer<typeof updateCouponSchema>;
export type ValidateCouponInput = z.infer<typeof validateCouponSchema>;
export type ApplyCouponInput = z.infer<typeof applyCouponSchema>;
export type GetCouponInput = z.infer<typeof getCouponSchema>;
export type GetCouponsInput = z.infer<typeof getCouponsSchema>;
export type GetCouponByCodeInput = z.infer<typeof getCouponByCodeSchema>;
