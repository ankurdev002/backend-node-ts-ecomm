import express from "express";
import { ENDPOINTS } from "../constants/endpoint";
import { USER_ROLES } from "../constants/user_roles";
import {
  createOrder,
  verifyPayment,
  getPaymentDetails,
  refundPaymentMethod,
  getAllPayments,
} from "../controllers/payment.controller";
import { authenticateUser } from "../middleware/auth.middleware";
import { authorizeRole } from "../middleware/role.middleware";
import { validate } from "../middleware/validate.middleware";
import {
  createOrderSchema,
  getAllPaymentsSchema,
  paymentIdParamSchema,
  refundPaymentSchema,
  verifyPaymentSchema,
} from "../schema/payment.schema";

const router = express.Router();

// Create payment order
router.post(
  ENDPOINTS.PAYMENT_ROUTE.CERATE_PAYMENT_ORDER,
  authenticateUser,
  validate(createOrderSchema),
  createOrder
);

// Verify payment
router.post(
  ENDPOINTS.PAYMENT_ROUTE.VERIFY_PAYMENT,
  validate(verifyPaymentSchema),
  verifyPayment
);

// Get payment details
router.get(
  ENDPOINTS.PAYMENT_ROUTE.GET_PAYMENT_DETAILS,
  authenticateUser,
  validate(paymentIdParamSchema),
  getPaymentDetails
);

// Refund payment (Admin only)
router.post(
  ENDPOINTS.PAYMENT_ROUTE.REFUND_PAYMENT,
  authenticateUser,
  authorizeRole([USER_ROLES.ADMIN]),
  validate(refundPaymentSchema),
  refundPaymentMethod
);

// Get all payments (Admin only)
router.get(
  ENDPOINTS.PAYMENT_ROUTE.GET_ALL_PAYMENTS,
  authenticateUser,
  authorizeRole([USER_ROLES.ADMIN]),
  // validate(getAllPaymentsSchema),
  getAllPayments
);

export default router;
