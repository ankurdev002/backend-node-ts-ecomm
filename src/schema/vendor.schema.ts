import { z } from "zod";

// Schema for vendor dashboard
export const vendorDashboardSchema = z.object({
  query: z.object({
    startDate: z
      .string()
      .datetime({ message: "Invalid start date format" })
      .optional(),
    endDate: z
      .string()
      .datetime({ message: "Invalid end date format" })
      .optional(),
  }),
});

// Schema for getting vendor products
export const getVendorProductsSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/, "Page must be a number").optional(),
    limit: z.string().regex(/^\d+$/, "Limit must be a number").optional(),
    status: z.enum(["active", "inactive"]).optional(),
    search: z.string().optional(),
    category: z.string().optional(),
    sortBy: z.enum(["name", "price", "createdAt", "sales"]).optional(),
    sortOrder: z.enum(["ASC", "DESC"]).optional(),
  }),
});

// Schema for getting vendor orders
export const getVendorOrdersSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/, "Page must be a number").optional(),
    limit: z.string().regex(/^\d+$/, "Limit must be a number").optional(),
    status: z
      .enum([
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "out_for_delivery",
        "delivered",
        "cancelled",
        "returned",
        "refunded",
      ])
      .optional(),
    startDate: z
      .string()
      .datetime({ message: "Invalid start date format" })
      .optional(),
    endDate: z
      .string()
      .datetime({ message: "Invalid end date format" })
      .optional(),
    search: z.string().optional(),
    sortBy: z.enum(["orderId", "totalAmount", "createdAt"]).optional(),
    sortOrder: z.enum(["ASC", "DESC"]).optional(),
  }),
});

// Schema for updating order status by vendor
export const updateOrderStatusByVendorSchema = z.object({
  params: z.object({
    orderId: z.string().regex(/^\d+$/, "Order ID must be a number"),
  }),
  body: z.object({
    status: z.enum(["confirmed", "processing", "shipped", "cancelled"], {
      required_error: "Status is required",
      invalid_type_error: "Invalid status value",
    }),
    notes: z
      .string()
      .max(500, "Notes must be less than 500 characters")
      .optional(),
  }),
});

// Schema for getting inventory report
export const getInventoryReportSchema = z.object({
  query: z.object({
    lowStock: z.enum(["true", "false"]).optional(),
    outOfStock: z.enum(["true", "false"]).optional(),
    category: z.string().optional(),
    sortBy: z.enum(["productName", "quantity", "reorderLevel"]).optional(),
    sortOrder: z.enum(["ASC", "DESC"]).optional(),
  }),
});

export type VendorDashboardDTO = z.infer<typeof vendorDashboardSchema>;
export type GetVendorProductsDTO = z.infer<typeof getVendorProductsSchema>;
export type GetVendorOrdersDTO = z.infer<typeof getVendorOrdersSchema>;
export type UpdateOrderStatusByVendorDTO = z.infer<
  typeof updateOrderStatusByVendorSchema
>;
export type GetInventoryReportDTO = z.infer<typeof getInventoryReportSchema>;
