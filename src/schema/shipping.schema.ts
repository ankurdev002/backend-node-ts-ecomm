import { z } from "zod";

// Schema for updating shipping status
export const updateShippingStatusSchema = z.object({
  params: z.object({
    shippingId: z.string().regex(/^\d+$/, "Shipping ID must be a number"),
  }),
  body: z.object({
    status: z.enum(
      [
        "pending",
        "picked_up",
        "in_transit",
        "out_for_delivery",
        "delivered",
        "failed_delivery",
        "returned",
      ],
      {
        required_error: "Status is required",
        invalid_type_error: "Invalid shipping status",
      }
    ),
    trackingNumber: z.string().min(1, "Tracking number is required").optional(),
    location: z
      .string()
      .max(200, "Location must be less than 200 characters")
      .optional(),
    estimatedDelivery: z
      .string()
      .datetime({ message: "Invalid estimated delivery date format" })
      .optional(),
    actualDelivery: z
      .string()
      .datetime({ message: "Invalid actual delivery date format" })
      .optional(),
    notes: z
      .string()
      .max(500, "Notes must be less than 500 characters")
      .optional(),
    carrier: z
      .string()
      .max(100, "Carrier name must be less than 100 characters")
      .optional(),
    trackingUrl: z.string().url("Invalid tracking URL").optional(),
  }),
});

// Schema for getting shipping info
export const getShippingInfoSchema = z.object({
  params: z.object({
    orderId: z.string().regex(/^\d+$/, "Order ID must be a number"),
  }),
});

// Schema for tracking shipment (public)
export const trackShipmentSchema = z.object({
  params: z.object({
    trackingNumber: z.string().min(1, "Tracking number is required"),
  }),
});

// Schema for getting delivery assignments
export const getDeliveryAssignmentsSchema = z.object({
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
    deliveryAgent: z.string().optional(),
    date: z.string().datetime({ message: "Invalid date format" }).optional(),
    priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
    sortBy: z
      .enum(["orderId", "assignedAt", "priority", "deliveryDate"])
      .optional(),
    sortOrder: z.enum(["ASC", "DESC"]).optional(),
  }),
});

export type UpdateShippingStatusDTO = z.infer<
  typeof updateShippingStatusSchema
>;
export type GetShippingInfoDTO = z.infer<typeof getShippingInfoSchema>;
export type TrackShipmentDTO = z.infer<typeof trackShipmentSchema>;
export type GetDeliveryAssignmentsDTO = z.infer<
  typeof getDeliveryAssignmentsSchema
>;
