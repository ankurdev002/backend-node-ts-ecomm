import { z } from "zod";

//SUPER CATEGORY -------------------------------------------------
// Base schema shared between create and update super category
const baseSuperCategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  isActive: z.boolean(),
});

// Schema for creating a SuperCategory (everything required)
export const createSuperCategorySchema = baseSuperCategorySchema;
// Schema for updating a SuperCategory (everything optional)
export const updateSuperCategorySchema = baseSuperCategorySchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field (name or isActive) must be provided",
  });
//    -------------------------------------------------------

// CATEGORY -------------------------------------------------
const baseCategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  superCategoryId: z.number().int("superCategoryId must be an integer"),
  isActive: z.boolean(),
});

// Create schema: all required
export const createCategorySchema = baseCategorySchema;

// Update schema: all optional, but at least one must be present
export const updateCategorySchema = baseCategorySchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message:
      "At least one field (name, superCategoryId, or isActive) must be provided",
  });

//    -------------------------------------------------------

// SUB CATEGORY -------------------------------------------------
// Base schema shared by both create and update
const baseSubCategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  categoryId: z.number().int("categoryId must be an integer"),
  superCategoryId: z.number().int("superCategoryId must be an integer"),
  isActive: z.boolean(),
});

// Create: all required
export const createSubCategorySchema = baseSubCategorySchema;

// Update: all optional, but at least one must be present
export const updateSubCategorySchema = baseSubCategorySchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message:
      "At least one field (name, categoryId, superCategoryId, or isActive) must be provided",
  });
//    -------------------------------------------------------

// PRODUCT CATEGROY SCHEMA -------------------------------------------------
// Shared base schema
const baseProductCategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  superCategoryId: z.number().int("superCategoryId must be an integer"),
  categoryId: z.number().int("categoryId must be an integer"),
  subCategoryId: z.number().int("subCategoryId must be an integer"),
  isActive: z.boolean(),
});

// Create schema — all fields required
export const createProductCategorySchema = baseProductCategorySchema;

// Update schema — all fields optional but at least one required
export const updateProductCategorySchema = baseProductCategorySchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message:
      "At least one field (name, superCategoryId, categoryId, subCategoryId, or isActive) must be provided",
  });

//    -------------------------------------------------------

// Inferred types (optional, for strong typing)
export type CreateSuperCategoryDTO = z.infer<typeof createSuperCategorySchema>;
export type UpdateSuperCategoryDTO = z.infer<typeof updateSuperCategorySchema>;
// Type definitions (optional)
export type CreateCategoryDTO = z.infer<typeof createCategorySchema>;
export type UpdateCategoryDTO = z.infer<typeof updateCategorySchema>;
// Optional: Type inference
export type CreateSubCategoryDTO = z.infer<typeof createSubCategorySchema>;
export type UpdateSubCategoryDTO = z.infer<typeof updateSubCategorySchema>;
// Optional: Inferred types
export type CreateProductCategoryDTO = z.infer<
  typeof createProductCategorySchema
>;
export type UpdateProductCategoryDTO = z.infer<
  typeof updateProductCategorySchema
>;
