import { z } from "zod";

// Schema for creating/updating address
export const addressSchema = z.object({
  body: z.object({
    type: z.enum(["billing", "shipping"], {
      required_error: "Address type is required",
      invalid_type_error: "Type must be either 'billing' or 'shipping'",
    }),
    firstName: z
      .string()
      .min(1, "First name is required")
      .max(50, "First name must be less than 50 characters"),
    lastName: z
      .string()
      .min(1, "Last name is required")
      .max(50, "Last name must be less than 50 characters"),
    company: z
      .string()
      .max(100, "Company name must be less than 100 characters")
      .optional(),
    street: z
      .string()
      .min(1, "Street address is required")
      .max(200, "Street address must be less than 200 characters"),
    city: z
      .string()
      .min(1, "City is required")
      .max(100, "City must be less than 100 characters"),
    state: z
      .string()
      .min(1, "State is required")
      .max(100, "State must be less than 100 characters"),
    country: z
      .string()
      .min(1, "Country is required")
      .max(100, "Country must be less than 100 characters"),
    zipCode: z
      .string()
      .min(1, "ZIP code is required")
      .max(20, "ZIP code must be less than 20 characters"),
    phone: z
      .string()
      .regex(/^[\+]?[1-9][\d]{0,15}$/, "Invalid phone number format")
      .optional(),
    isDefault: z.boolean().optional().default(false),
  }),
});

// Schema for updating address
export const updateAddressSchema = z.object({
  params: z.object({
    addressId: z.string().regex(/^\d+$/, "Address ID must be a number"),
  }),
  body: z.object({
    type: z.enum(["billing", "shipping"]).optional(),
    firstName: z
      .string()
      .min(1, "First name is required")
      .max(50, "First name must be less than 50 characters")
      .optional(),
    lastName: z
      .string()
      .min(1, "Last name is required")
      .max(50, "Last name must be less than 50 characters")
      .optional(),
    company: z
      .string()
      .max(100, "Company name must be less than 100 characters")
      .optional(),
    street: z
      .string()
      .min(1, "Street address is required")
      .max(200, "Street address must be less than 200 characters")
      .optional(),
    city: z
      .string()
      .min(1, "City is required")
      .max(100, "City must be less than 100 characters")
      .optional(),
    state: z
      .string()
      .min(1, "State is required")
      .max(100, "State must be less than 100 characters")
      .optional(),
    country: z
      .string()
      .min(1, "Country is required")
      .max(100, "Country must be less than 100 characters")
      .optional(),
    zipCode: z
      .string()
      .min(1, "ZIP code is required")
      .max(20, "ZIP code must be less than 20 characters")
      .optional(),
    phone: z
      .string()
      .regex(/^[\+]?[1-9][\d]{0,15}$/, "Invalid phone number format")
      .optional(),
    isDefault: z.boolean().optional(),
  }),
});

// Schema for address parameters
export const addressParamsSchema = z.object({
  params: z.object({
    addressId: z.string().regex(/^\d+$/, "Address ID must be a number"),
  }),
});

// Schema for default address type
export const defaultAddressSchema = z.object({
  params: z.object({
    type: z.enum(["billing", "shipping"], {
      required_error: "Address type is required",
      invalid_type_error: "Type must be either 'billing' or 'shipping'",
    }),
  }),
});

// Schema for address query filters
export const addressQuerySchema = z.object({
  query: z.object({
    type: z.enum(["billing", "shipping"]).optional(),
  }),
});

export type CreateAddressInput = z.infer<typeof addressSchema>;
export type UpdateAddressInput = z.infer<typeof updateAddressSchema>;
export type AddressParamsInput = z.infer<typeof addressParamsSchema>;
export type DefaultAddressInput = z.infer<typeof defaultAddressSchema>;
export type AddressQueryInput = z.infer<typeof addressQuerySchema>;
