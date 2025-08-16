import { z } from "zod";

// Schema for creating an order
export const createOrderSchema = z.object({
  body: z.object({
    shippingAddressId: z
      .number()
      .int()
      .positive("Shipping address ID is required"),
    billingAddressId: z.number().int().positive().optional(),
    paymentMethod: z
      .enum(
        [
          "credit_card",
          "debit_card",
          "paypal",
          "stripe",
          "cash_on_delivery",
          "razorpay",
        ],
        {
          required_error: "Payment method is required",
          invalid_type_error: "Invalid payment method",
        }
      )
      .optional(),
    deliveryDate: z
      .string()
      .datetime({ message: "Invalid delivery date format" })
      .optional(),
    notes: z
      .string()
      .max(500, "Notes must be less than 500 characters")
      .optional(),
    couponCode: z
      .string()
      .max(50, "Coupon code must be less than 50 characters")
      .optional(),
  }),
});

// Schema for updating order status
export const updateOrderStatusSchema = z.object({
  params: z.object({
    orderId: z.string().regex(/^\d+$/, "Order ID must be a number"),
  }),
  body: z.object({
    status: z.enum(
      [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "out_for_delivery",
        "delivered",
        "cancelled",
        "returned",
        "refunded",
      ],
      {
        required_error: "Status is required",
        invalid_type_error: "Invalid status value",
      }
    ),
    paymentStatus: z.enum(["pending", "completed", "failed", "refunded"], {
      required_error: "Payment status is required",
      invalid_type_error: "Invalid payment status value",
    }),
  }),
});

// Schema for order parameters
export const orderParamsSchema = z.object({
  params: z.object({
    orderId: z.string().regex(/^\d+$/, "Order ID must be a number"),
  }),
});

// Schema for order status parameters
export const orderStatusParamsSchema = z.object({
  params: z.object({
    status: z.enum(
      [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "out_for_delivery",
        "delivered",
        "cancelled",
        "returned",
        "refunded",
      ],
      {
        required_error: "Status is required",
        invalid_type_error: "Invalid status value",
      }
    ),
  }),
});

// Schema for order query filters
export const orderQuerySchema = z.object({
  query: z.object({
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
    page: z
      .string()
      .regex(/^\d+$/, "Page must be a number")
      .transform(Number)
      .optional(),
    limit: z
      .string()
      .regex(/^\d+$/, "Limit must be a number")
      .transform(Number)
      .optional(),
  }),
});

// Schema for cancelling an order
export const cancelOrderSchema = z.object({
  params: z.object({
    orderId: z.string().regex(/^\d+$/, "Order ID must be a number"),
  }),
  body: z.object({
    reason: z
      .string()
      .min(1, "Cancellation reason is required")
      .max(500, "Reason must be less than 500 characters")
      .optional(),
  }),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
export type OrderParamsInput = z.infer<typeof orderParamsSchema>;
export type OrderStatusParamsInput = z.infer<typeof orderStatusParamsSchema>;
export type OrderQueryInput = z.infer<typeof orderQuerySchema>;
export type CancelOrderInput = z.infer<typeof cancelOrderSchema>;
