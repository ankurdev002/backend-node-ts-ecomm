import express from "express";
import { USER_ROLES } from "../constants/user_roles";
import PaymentController from "../controllers/payment.controller";
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
const controller = PaymentController;

// Create payment order
router.post(
  "/create-order",
  authenticateUser,
  validate(createOrderSchema),
  controller.createOrder.bind(controller)
);

// Verify payment
router.post(
  "/verify",
  validate(verifyPaymentSchema),
  controller.verifyPayment.bind(controller)
);

// Get payment details
router.get(
  "/:paymentId",
  authenticateUser,
  validate(paymentIdParamSchema),
  controller.getPaymentDetails.bind(controller)
);

// Refund payment (Admin only)
router.post(
  "/:paymentId/refund",
  authenticateUser,
  authorizeRole([USER_ROLES.ADMIN]),
  validate(refundPaymentSchema),
  controller.refundPayment.bind(controller)
);

// Get all payments (Admin only)
router.get(
  "/",
  authenticateUser,
  authorizeRole([USER_ROLES.ADMIN]),
  validate(getAllPaymentsSchema),
  controller.getAllPayments.bind(controller)
);

export default router;
