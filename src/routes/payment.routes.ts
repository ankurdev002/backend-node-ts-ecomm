import { Router } from "express";
import {
  initiatePayment,
  handlePaymentCallback,
  processStripeCallback,
  processPayPalCallback,
  refundOrderPayment,
  getOrderPayments,
  getPayment,
} from "../controllers/payment.controller";
import { authenticateUser } from "../middleware/auth.middleware";
import { authorizeRole } from "../middleware/role.middleware";
import { USER_ROLES } from "../constants/user_roles";

const router = Router();

// @route POST /api/payments/initiate
// @desc Initiate payment for an order
// @access Private
router.post("/initiate", authenticateUser, initiatePayment);

// @route POST /api/payments/:paymentId/callback
// @desc Handle payment gateway callback
// @access Public (called by payment gateways)
router.post("/:paymentId/callback", handlePaymentCallback);

// @route POST /api/payments/:paymentId/stripe/callback
// @desc Handle Stripe payment callback
// @access Public
router.post("/:paymentId/stripe/callback", processStripeCallback);

// @route POST /api/payments/:paymentId/paypal/callback
// @desc Handle PayPal payment callback
// @access Public
router.post("/:paymentId/paypal/callback", processPayPalCallback);

// @route POST /api/payments/:paymentId/refund
// @desc Refund payment (Admin only)
// @access Private (Admin)
router.post(
  "/:paymentId/refund",
  authenticateUser,
  authorizeRole([USER_ROLES.ADMIN]),
  refundOrderPayment
);

// @route GET /api/payments/order/:orderId
// @desc Get all payments for an order
// @access Private
router.get("/order/:orderId", authenticateUser, getOrderPayments);

// @route GET /api/payments/:paymentId
// @desc Get payment details
// @access Private
router.get("/:paymentId", authenticateUser, getPayment);

export default router;
