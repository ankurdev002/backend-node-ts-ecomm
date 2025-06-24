import { z } from "zod";

// Pricing item schema (you can expand this further)
const pricingSchema = z.object({
  label: z.string().optional(),
  price: z.number().optional(),
  discount: z.number().optional(),
  country: z.string().optional(),
  currency: z.string().optional(),
  currencySymbol: z.string().optional(),
  actualPrice: z.number().optional(),
  discountAmount: z.number().optional(),
  finalPrice: z.number().optional(),
});

// Images schema (record of color to array of image URLs)
const imagesSchema = z.record(z.string(), z.array(z.string().url()));

// Attributes schema
const attributesSchema = z.object({
  brand: z.string().optional(),
  capacity: z.string().optional(),
  speedSettings: z.number().optional(),
  power: z.string().optional(),
});

// Shared base schema
const baseProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  productCategoryId: z.number().int(),
  superCategoryId: z.number().int(),
  categoryId: z.number().int(),
  subCategoryId: z.number().int(),
  isActive: z.boolean(),
  productType: z.string().min(1, "Product type is required"),
  pricing: z
    .array(pricingSchema)
    .min(1, "At least one pricing object is required"),
  images: imagesSchema,
  attributes: attributesSchema,
});

// Create schema — all fields + userId required
export const createProductSchema = baseProductSchema.extend({
  userId: z.number().int().min(1, "userId is required"),
});

// Update: all optional, but at least one field must be present
export const updateProductSchema = baseProductSchema
  .partial()
  .extend({
    userId: z.number().int().min(1, "userId is required"),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided to update the product.",
  });

// Type inference (optional)
export type CreateProductDTO = z.infer<typeof createProductSchema>;
export type UpdateProductDTO = z.infer<typeof updateProductSchema>;
