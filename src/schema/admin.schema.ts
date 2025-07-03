import { z } from "zod";

// Schema for admin dashboard
export const adminDashboardSchema = z.object({
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

// Schema for getting all users
export const getAllUsersSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/, "Page must be a number").optional(),
    limit: z.string().regex(/^\d+$/, "Limit must be a number").optional(),
    userType: z.enum(["normal", "vendor", "delivery", "admin"]).optional(),
    status: z.enum(["active", "inactive"]).optional(),
    search: z.string().optional(),
    sortBy: z.enum(["name", "email", "createdAt"]).optional(),
    sortOrder: z.enum(["ASC", "DESC"]).optional(),
  }),
});

// Schema for getting all orders (admin)
export const getAllOrdersSchema = z.object({
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

// Schema for updating user status
export const updateUserStatusSchema = z.object({
  params: z.object({
    userId: z.string().regex(/^\d+$/, "User ID must be a number"),
  }),
  body: z.object({
    isActive: z.boolean(),
    reason: z
      .string()
      .max(500, "Reason must be less than 500 characters")
      .optional(),
  }),
});

// Schema for revenue report
export const getRevenueReportSchema = z.object({
  query: z.object({
    startDate: z.string().datetime({ message: "Invalid start date format" }),
    endDate: z.string().datetime({ message: "Invalid end date format" }),
    groupBy: z.enum(["day", "week", "month", "year"]).optional(),
    category: z.string().optional(),
    vendor: z.string().optional(),
  }),
});

export type AdminDashboardDTO = z.infer<typeof adminDashboardSchema>;
export type GetAllUsersDTO = z.infer<typeof getAllUsersSchema>;
export type GetAllOrdersDTO = z.infer<typeof getAllOrdersSchema>;
export type UpdateUserStatusDTO = z.infer<typeof updateUserStatusSchema>;
export type GetRevenueReportDTO = z.infer<typeof getRevenueReportSchema>;
