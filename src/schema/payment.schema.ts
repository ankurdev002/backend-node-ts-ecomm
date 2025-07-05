import { z } from "zod";

// Route validation schemas
export const createOrderSchema = z.object({
  body: z.object({
    amount: z.number().min(1),
    currency: z.string().length(3).optional(),
  }),
});

export const verifyPaymentSchema = z.object({
  body: z.object({
    razorpay_order_id: z.string(),
    razorpay_payment_id: z.string(),
    razorpay_signature: z.string(),
  }),
});

export const paymentIdParamSchema = z.object({
  params: z.object({
    paymentId: z.string(),
  }),
});

export const refundPaymentSchema = z.object({
  params: z.object({
    paymentId: z.string(),
  }),
  body: z.object({
    amount: z.number().min(1).optional(),
  }),
});

export const getAllPaymentsSchema = z.object({
  query: z.object({
    from: z.string().datetime().optional(),
    to: z.string().datetime().optional(),
    skip: z
      .string()
      .regex(/^[0-9]+$/)
      .optional(),
    count: z
      .string()
      .regex(/^[0-9]+$/)
      .optional(),
  }),
});
