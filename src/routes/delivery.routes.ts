import { Router } from "express";
import {
  getDeliveryDashboard,
  getAssignedOrders,
  updateDeliveryStatus,
  getDeliveryRoute,
} from "../controllers/delivery.controller";
import { authenticateUser } from "../middleware/auth.middleware";
import { authorizeRole } from "../middleware/role.middleware";
import { USER_ROLES } from "../constants/user_roles";

const router = Router();

// All delivery routes require authentication and delivery role
router.use(authenticateUser);
router.use(authorizeRole([USER_ROLES.DELIVERY]));

// @route GET /api/delivery/dashboard
// @desc Get delivery dashboard statistics
// @access Private (Delivery)
router.get("/dashboard", getDeliveryDashboard);

// @route GET /api/delivery/orders
// @desc Get assigned orders with filters and pagination
// @access Private (Delivery)
router.get("/orders", getAssignedOrders);

// @route PUT /api/delivery/orders/:orderId/status
// @desc Update delivery status for an order
// @access Private (Delivery)
router.put("/orders/:orderId/status", updateDeliveryStatus);

// @route GET /api/delivery/route
// @desc Get delivery route for a specific date
// @access Private (Delivery)
router.get("/route", getDeliveryRoute);

export default router;
