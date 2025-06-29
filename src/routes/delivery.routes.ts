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
import { ENDPOINTS } from "../constants/endpoint";

const router = Router();

// All delivery routes require authentication and delivery role
router.use(authenticateUser);
router.use(authorizeRole([USER_ROLES.DELIVERY]));

// @route GET /api/delivery/dashboard
// @desc Get delivery dashboard statistics
// @access Private (Delivery)
router.get(ENDPOINTS.DELIVERY_ROUTE.GET_DELIVERY_DASHBOARD, getDeliveryDashboard);

// @route GET /api/delivery/orders
// @desc Get assigned orders with filters and pagination
// @access Private (Delivery)
router.get(ENDPOINTS.DELIVERY_ROUTE.GET_ASSIGNED_ORDERS, getAssignedOrders);

// @route PUT /api/delivery/orders/:orderId/status
// @desc Update delivery status for an order
// @access Private (Delivery)
router.put(ENDPOINTS.DELIVERY_ROUTE.UPDATE_DELIVERY_STATUS, updateDeliveryStatus);

// @route GET /api/delivery/route
// @desc Get delivery route for a specific date
// @access Private (Delivery)
router.get(ENDPOINTS.DELIVERY_ROUTE.GET_DELIVERY_ROUTE, getDeliveryRoute);

export default router;
