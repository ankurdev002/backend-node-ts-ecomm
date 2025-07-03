import { z } from "zod";

// Schema for delivery dashboard
export const deliveryDashboardSchema = z.object({
  query: z.object({
    date: z.string().datetime({ message: "Invalid date format" }).optional(),
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

// Schema for getting assigned orders
export const getAssignedOrdersSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/, "Page must be a number").optional(),
    limit: z.string().regex(/^\d+$/, "Limit must be a number").optional(),
    status: z
      .enum([
        "assigned",
        "picked_up",
        "in_transit",
        "out_for_delivery",
        "delivered",
        "failed_delivery",
        "returned",
      ])
      .optional(),
    date: z.string().datetime({ message: "Invalid date format" }).optional(),
    priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
    sortBy: z
      .enum(["orderId", "assignedAt", "priority", "deliveryDate"])
      .optional(),
    sortOrder: z.enum(["ASC", "DESC"]).optional(),
  }),
});

// Schema for updating delivery status
export const updateDeliveryStatusSchema = z.object({
  params: z.object({
    orderId: z.string().regex(/^\d+$/, "Order ID must be a number"),
  }),
  body: z.object({
    status: z.enum(
      [
        "assigned",
        "picked_up",
        "in_transit",
        "out_for_delivery",
        "delivered",
        "failed_delivery",
        "returned",
      ],
      {
        required_error: "Status is required",
        invalid_type_error: "Invalid delivery status",
      }
    ),
    location: z
      .string()
      .max(200, "Location must be less than 200 characters")
      .optional(),
    notes: z
      .string()
      .max(500, "Notes must be less than 500 characters")
      .optional(),
    timestamp: z
      .string()
      .datetime({ message: "Invalid timestamp format" })
      .optional(),
    deliveryProof: z.string().optional(), // URL or base64 string for delivery proof
    recipientName: z.string().optional(),
    recipientSignature: z.string().optional(),
  }),
});

// Schema for getting delivery route
export const getDeliveryRouteSchema = z.object({
  query: z.object({
    date: z.string().datetime({ message: "Invalid date format" }).optional(),
    optimize: z.enum(["true", "false"]).optional(),
    startLocation: z.string().optional(),
    endLocation: z.string().optional(),
  }),
});

export type DeliveryDashboardDTO = z.infer<typeof deliveryDashboardSchema>;
export type GetAssignedOrdersDTO = z.infer<typeof getAssignedOrdersSchema>;
export type UpdateDeliveryStatusDTO = z.infer<
  typeof updateDeliveryStatusSchema
>;
export type GetDeliveryRouteDTO = z.infer<typeof getDeliveryRouteSchema>;
