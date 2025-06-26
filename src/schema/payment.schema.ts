import { z } from "zod";

// Schema for initiating payment
export const initiatePaymentSchema = z.object({
  body: z.object({
    orderId: z.number().int().positive("Order ID is required"),
    paymentMethod: z.enum(
      [
        "credit_card",
        "debit_card",
        "paypal",
        "stripe",
        "cash_on_delivery",
        "bank_transfer",
      ],
      {
        required_error: "Payment method is required",
        invalid_type_error: "Invalid payment method",
      }
    ),
    paymentGateway: z
      .enum(["stripe", "paypal", "razorpay", "square"], {
        invalid_type_error: "Invalid payment gateway",
      })
      .optional(),
    amount: z.number().positive("Amount must be positive"),
    currency: z
      .string()
      .length(3, "Currency must be a 3-letter code")
      .default("USD"),
  }),
});

// Schema for payment callback
export const paymentCallbackSchema = z.object({
  params: z.object({
    paymentId: z.string().regex(/^\d+$/, "Payment ID must be a number"),
  }),
  body: z.object({
    status: z.enum(["pending", "completed", "failed", "cancelled"], {
      required_error: "Payment status is required",
      invalid_type_error: "Invalid payment status",
    }),
    transactionId: z.string().optional(),
    gatewayTransactionId: z.string().optional(),
    gatewayResponse: z.record(z.any()).optional(),
    failureReason: z.string().optional(),
  }),
});

// Schema for Stripe payment callback
export const stripeCallbackSchema = z.object({
  params: z.object({
    paymentId: z.string().regex(/^\d+$/, "Payment ID must be a number"),
  }),
  body: z.object({
    paymentIntentId: z.string().min(1, "Payment intent ID is required"),
    amount: z.number().positive("Amount must be positive"),
    status: z.enum(["succeeded", "failed", "cancelled"]).optional(),
    metadata: z.record(z.any()).optional(),
  }),
});

// Schema for PayPal payment callback
export const paypalCallbackSchema = z.object({
  params: z.object({
    paymentId: z.string().regex(/^\d+$/, "Payment ID must be a number"),
  }),
  body: z.object({
    paypalOrderId: z.string().min(1, "PayPal order ID is required"),
    amount: z.number().positive("Amount must be positive"),
    status: z.enum(["COMPLETED", "FAILED", "CANCELLED"]).optional(),
    payerId: z.string().optional(),
    metadata: z.record(z.any()).optional(),
  }),
});

// Schema for payment refund
export const refundPaymentSchema = z.object({
  params: z.object({
    paymentId: z.string().regex(/^\d+$/, "Payment ID must be a number"),
  }),
  body: z.object({
    refundAmount: z.number().positive("Refund amount must be positive"),
    refundReason: z
      .string()
      .min(1, "Refund reason is required")
      .max(500, "Refund reason must be less than 500 characters"),
  }),
});

// Schema for payment parameters
export const paymentParamsSchema = z.object({
  params: z.object({
    paymentId: z.string().regex(/^\d+$/, "Payment ID must be a number"),
  }),
});

// Schema for order payments
export const orderPaymentsSchema = z.object({
  params: z.object({
    orderId: z.string().regex(/^\d+$/, "Order ID must be a number"),
  }),
});

// Schema for payment query filters
export const paymentQuerySchema = z.object({
  query: z.object({
    status: z
      .enum(["pending", "completed", "failed", "cancelled", "refunded"])
      .optional(),
    paymentMethod: z
      .enum([
        "credit_card",
        "debit_card",
        "paypal",
        "stripe",
        "cash_on_delivery",
        "bank_transfer",
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

export type InitiatePaymentInput = z.infer<typeof initiatePaymentSchema>;
export type PaymentCallbackInput = z.infer<typeof paymentCallbackSchema>;
export type StripeCallbackInput = z.infer<typeof stripeCallbackSchema>;
export type PaypalCallbackInput = z.infer<typeof paypalCallbackSchema>;
export type RefundPaymentInput = z.infer<typeof refundPaymentSchema>;
export type PaymentParamsInput = z.infer<typeof paymentParamsSchema>;
export type OrderPaymentsInput = z.infer<typeof orderPaymentsSchema>;
export type PaymentQueryInput = z.infer<typeof paymentQuerySchema>;
