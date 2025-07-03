import { z } from "zod";

// Schema for creating inventory
export const createInventorySchema = z.object({
  body: z.object({
    productId: z
      .number()
      .int()
      .positive("Product ID must be a positive integer"),
    sku: z
      .string()
      .min(1, "SKU is required")
      .max(50, "SKU must be less than 50 characters"),
    quantity: z.number().int().min(0, "Quantity cannot be negative"),
    reorderLevel: z.number().int().min(0, "Reorder level cannot be negative"),
    maxStockLevel: z
      .number()
      .int()
      .min(0, "Max stock level cannot be negative")
      .optional(),
    location: z
      .string()
      .max(100, "Location must be less than 100 characters")
      .optional(),
    supplier: z
      .string()
      .max(100, "Supplier must be less than 100 characters")
      .optional(),
    costPrice: z.number().min(0, "Cost price cannot be negative").optional(),
    notes: z
      .string()
      .max(500, "Notes must be less than 500 characters")
      .optional(),
  }),
});

// Schema for getting product inventory
export const getProductInventorySchema = z.object({
  params: z.object({
    productId: z.string().regex(/^\d+$/, "Product ID must be a number"),
  }),
});

// Schema for updating product inventory
export const updateProductInventorySchema = z.object({
  params: z.object({
    productId: z.string().regex(/^\d+$/, "Product ID must be a number"),
  }),
  body: z.object({
    quantity: z.number().int().min(0, "Quantity cannot be negative").optional(),
    reorderLevel: z
      .number()
      .int()
      .min(0, "Reorder level cannot be negative")
      .optional(),
    maxStockLevel: z
      .number()
      .int()
      .min(0, "Max stock level cannot be negative")
      .optional(),
    sku: z
      .string()
      .min(1, "SKU is required")
      .max(50, "SKU must be less than 50 characters")
      .optional(),
    location: z
      .string()
      .max(100, "Location must be less than 100 characters")
      .optional(),
    supplier: z
      .string()
      .max(100, "Supplier must be less than 100 characters")
      .optional(),
    costPrice: z.number().min(0, "Cost price cannot be negative").optional(),
    notes: z
      .string()
      .max(500, "Notes must be less than 500 characters")
      .optional(),
  }),
});

// Schema for restocking product
export const restockProductSchema = z.object({
  params: z.object({
    productId: z.string().regex(/^\d+$/, "Product ID must be a number"),
  }),
  body: z.object({
    quantity: z.number().int().min(1, "Quantity must be at least 1"),
    reason: z
      .string()
      .max(200, "Reason must be less than 200 characters")
      .optional(),
    supplier: z
      .string()
      .max(100, "Supplier must be less than 100 characters")
      .optional(),
    costPrice: z.number().min(0, "Cost price cannot be negative").optional(),
    batchNumber: z
      .string()
      .max(50, "Batch number must be less than 50 characters")
      .optional(),
    expiryDate: z
      .string()
      .datetime({ message: "Invalid expiry date format" })
      .optional(),
  }),
});

// Schema for getting low stock products
export const getLowStockProductsSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/, "Page must be a number").optional(),
    limit: z.string().regex(/^\d+$/, "Limit must be a number").optional(),
    threshold: z
      .string()
      .regex(/^\d+$/, "Threshold must be a number")
      .optional(),
    category: z.string().optional(),
    sortBy: z.enum(["productName", "quantity", "reorderLevel"]).optional(),
    sortOrder: z.enum(["ASC", "DESC"]).optional(),
  }),
});

// Schema for getting out of stock products
export const getOutOfStockProductsSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/, "Page must be a number").optional(),
    limit: z.string().regex(/^\d+$/, "Limit must be a number").optional(),
    category: z.string().optional(),
    sortBy: z.enum(["productName", "lastStocked", "priority"]).optional(),
    sortOrder: z.enum(["ASC", "DESC"]).optional(),
  }),
});

// Schema for getting inventory report
export const getInventoryReportSchema = z.object({
  query: z.object({
    startDate: z
      .string()
      .datetime({ message: "Invalid start date format" })
      .optional(),
    endDate: z
      .string()
      .datetime({ message: "Invalid end date format" })
      .optional(),
    category: z.string().optional(),
    supplier: z.string().optional(),
    location: z.string().optional(),
    reportType: z
      .enum(["summary", "detailed", "movement", "valuation"])
      .optional(),
    groupBy: z.enum(["category", "supplier", "location", "month"]).optional(),
  }),
});

export type CreateInventoryDTO = z.infer<typeof createInventorySchema>;
export type GetProductInventoryDTO = z.infer<typeof getProductInventorySchema>;
export type UpdateProductInventoryDTO = z.infer<
  typeof updateProductInventorySchema
>;
export type RestockProductDTO = z.infer<typeof restockProductSchema>;
export type GetLowStockProductsDTO = z.infer<typeof getLowStockProductsSchema>;
export type GetOutOfStockProductsDTO = z.infer<
  typeof getOutOfStockProductsSchema
>;
export type GetInventoryReportDTO = z.infer<typeof getInventoryReportSchema>;
