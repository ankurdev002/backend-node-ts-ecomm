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
import { ENDPOINTS } from "../constants/endpoint";

const router = Router();

// @route POST /api/payments/initiate
// @desc Initiate payment for an order
// @access Private
router.post(ENDPOINTS.PAYMENT_ROUTE.INITIATE_PAYMENT, authenticateUser, initiatePayment);

// @route POST /api/payments/:paymentId/callback
// @desc Handle payment gateway callback
// @access Public (called by payment gateways)
router.post(ENDPOINTS.PAYMENT_ROUTE.PAYMENT_CALLBACK, handlePaymentCallback);

// @route POST /api/payments/:paymentId/stripe/callback
// @desc Handle Stripe payment callback
// @access Public
router.post(ENDPOINTS.PAYMENT_ROUTE.STRIPE_CALLBACK, processStripeCallback);

// @route POST /api/payments/:paymentId/paypal/callback
// @desc Handle PayPal payment callback
// @access Public
router.post(ENDPOINTS.PAYMENT_ROUTE.PAYPAL_CALLBACK, processPayPalCallback);

// @route POST /api/payments/:paymentId/refund
// @desc Refund payment (Admin only)
// @access Private (Admin)
router.post(
  ENDPOINTS.PAYMENT_ROUTE.REFUND_PAYMENT,
  authenticateUser,
  authorizeRole([USER_ROLES.ADMIN]),
  refundOrderPayment
);

// @route GET /api/payments/order/:orderId
// @desc Get all payments for an order
// @access Private
router.get(ENDPOINTS.PAYMENT_ROUTE.GET_ORDER_PAYMENTS, authenticateUser, getOrderPayments);

// @route GET /api/payments/:paymentId
// @desc Get payment details
// @access Private
router.get(ENDPOINTS.PAYMENT_ROUTE.GET_PAYMENT, authenticateUser, getPayment);

export default router;
