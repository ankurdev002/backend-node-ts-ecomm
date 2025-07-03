import { z } from "zod";

//SUPER CATEGORY -------------------------------------------------
// Base schema shared between create and update super category
const baseSuperCategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  isActive: z.boolean(),
});

// Schema for creating a SuperCategory (everything required)
export const createSuperCategorySchema = z.object({
  body: baseSuperCategorySchema,
});

// Schema for updating a SuperCategory (everything optional)
export const updateSuperCategorySchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "Super Category ID must be a number"),
  }),
  body: baseSuperCategorySchema
    .partial()
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field (name or isActive) must be provided",
    }),
});

// Get super category by ID schema
export const getSuperCategoryByIdSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "Super Category ID must be a number"),
  }),
});

// Get all super categories schema
export const getAllSuperCategoriesSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/, "Page must be a number").optional(),
    limit: z.string().regex(/^\d+$/, "Limit must be a number").optional(),
    search: z.string().optional(),
    isActive: z.enum(["true", "false"]).optional(),
  }),
});

// Delete super category schema
export const deleteSuperCategorySchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "Super Category ID must be a number"),
  }),
});

//    -------------------------------------------------------

// CATEGORY -------------------------------------------------
const baseCategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  superCategoryId: z.number().int("superCategoryId must be an integer"),
  isActive: z.boolean(),
});

// Create schema: all required
export const createCategorySchema = z.object({
  body: baseCategorySchema,
});

// Update schema: all optional, but at least one must be present
export const updateCategorySchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "Category ID must be a number"),
  }),
  body: baseCategorySchema
    .partial()
    .refine((data) => Object.keys(data).length > 0, {
      message:
        "At least one field (name, superCategoryId, or isActive) must be provided",
    }),
});

// Get category by ID schema
export const getCategoryByIdSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "Category ID must be a number"),
  }),
});

// Get all categories schema
export const getAllCategoriesSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/, "Page must be a number").optional(),
    limit: z.string().regex(/^\d+$/, "Limit must be a number").optional(),
    search: z.string().optional(),
    isActive: z.enum(["true", "false"]).optional(),
    superCategoryId: z
      .string()
      .regex(/^\d+$/, "Super Category ID must be a number")
      .optional(),
  }),
});

// Delete category schema
export const deleteCategorySchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "Category ID must be a number"),
  }),
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
export const createSubCategorySchema = z.object({
  body: baseSubCategorySchema,
});

// Update: all optional, but at least one must be present
export const updateSubCategorySchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "Sub Category ID must be a number"),
  }),
  body: baseSubCategorySchema
    .partial()
    .refine((data) => Object.keys(data).length > 0, {
      message:
        "At least one field (name, categoryId, superCategoryId, or isActive) must be provided",
    }),
});

// Get sub category by ID schema
export const getSubCategoryByIdSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "Sub Category ID must be a number"),
  }),
});

// Get all sub categories schema
export const getAllSubCategoriesSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/, "Page must be a number").optional(),
    limit: z.string().regex(/^\d+$/, "Limit must be a number").optional(),
    search: z.string().optional(),
    isActive: z.enum(["true", "false"]).optional(),
    categoryId: z
      .string()
      .regex(/^\d+$/, "Category ID must be a number")
      .optional(),
    superCategoryId: z
      .string()
      .regex(/^\d+$/, "Super Category ID must be a number")
      .optional(),
  }),
});

// Delete sub category schema
export const deleteSubCategorySchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "Sub Category ID must be a number"),
  }),
});

//    -------------------------------------------------------

// PRODUCT CATEGORY SCHEMA -------------------------------------------------
// Shared base schema
const baseProductCategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  superCategoryId: z.number().int("superCategoryId must be an integer"),
  categoryId: z.number().int("categoryId must be an integer"),
  subCategoryId: z.number().int("subCategoryId must be an integer"),
  isActive: z.boolean(),
});

// Create schema — all fields required
export const createProductCategorySchema = z.object({
  body: baseProductCategorySchema,
});

// Update schema — all fields optional but at least one required
export const updateProductCategorySchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "Product Category ID must be a number"),
  }),
  body: baseProductCategorySchema
    .partial()
    .refine((data) => Object.keys(data).length > 0, {
      message:
        "At least one field (name, superCategoryId, categoryId, subCategoryId, or isActive) must be provided",
    }),
});

// Get product category by ID schema
export const getProductCategoryByIdSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "Product Category ID must be a number"),
  }),
});

// Get all product categories schema
export const getAllProductCategoriesSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/, "Page must be a number").optional(),
    limit: z.string().regex(/^\d+$/, "Limit must be a number").optional(),
    search: z.string().optional(),
    isActive: z.enum(["true", "false"]).optional(),
    superCategoryId: z
      .string()
      .regex(/^\d+$/, "Super Category ID must be a number")
      .optional(),
    categoryId: z
      .string()
      .regex(/^\d+$/, "Category ID must be a number")
      .optional(),
    subCategoryId: z
      .string()
      .regex(/^\d+$/, "Sub Category ID must be a number")
      .optional(),
  }),
});

// Delete product category schema
export const deleteProductCategorySchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "Product Category ID must be a number"),
  }),
});

//    -------------------------------------------------------

// Inferred types (optional, for strong typing)
export type CreateSuperCategoryDTO = z.infer<typeof createSuperCategorySchema>;
export type UpdateSuperCategoryDTO = z.infer<typeof updateSuperCategorySchema>;
export type GetSuperCategoryByIdDTO = z.infer<
  typeof getSuperCategoryByIdSchema
>;
export type GetAllSuperCategoriesDTO = z.infer<
  typeof getAllSuperCategoriesSchema
>;
export type DeleteSuperCategoryDTO = z.infer<typeof deleteSuperCategorySchema>;

// Type definitions (optional)
export type CreateCategoryDTO = z.infer<typeof createCategorySchema>;
export type UpdateCategoryDTO = z.infer<typeof updateCategorySchema>;
export type GetCategoryByIdDTO = z.infer<typeof getCategoryByIdSchema>;
export type GetAllCategoriesDTO = z.infer<typeof getAllCategoriesSchema>;
export type DeleteCategoryDTO = z.infer<typeof deleteCategorySchema>;

// Optional: Type inference
export type CreateSubCategoryDTO = z.infer<typeof createSubCategorySchema>;
export type UpdateSubCategoryDTO = z.infer<typeof updateSubCategorySchema>;
export type GetSubCategoryByIdDTO = z.infer<typeof getSubCategoryByIdSchema>;
export type GetAllSubCategoriesDTO = z.infer<typeof getAllSubCategoriesSchema>;
export type DeleteSubCategoryDTO = z.infer<typeof deleteSubCategorySchema>;

// Optional: Inferred types
export type CreateProductCategoryDTO = z.infer<
  typeof createProductCategorySchema
>;
export type UpdateProductCategoryDTO = z.infer<
  typeof updateProductCategorySchema
>;
export type GetProductCategoryByIdDTO = z.infer<
  typeof getProductCategoryByIdSchema
>;
export type GetAllProductCategoriesDTO = z.infer<
  typeof getAllProductCategoriesSchema
>;
export type DeleteProductCategoryDTO = z.infer<
  typeof deleteProductCategorySchema
>;
