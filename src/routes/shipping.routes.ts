import { Router } from "express";
import {
  updateShippingStatus,
  getShippingInfo,
  trackShipment,
  getDeliveryAssignments,
} from "../controllers/shipping.controller";
import { authenticateUser } from "../middleware/auth.middleware";
import { authorizeRole } from "../middleware/role.middleware";
import { USER_ROLES } from "../constants/user_roles";
import { ENDPOINTS } from "../constants/endpoint";

const router = Router();

// @route PUT /api/shipping/:shippingId/status
// @desc Update shipping status (Admin/Delivery only)
// @access Private (Admin/Delivery)
router.put(
  ENDPOINTS.SHIPPING_ROUTE.UPDATE_SHIPPING_STATUS,
  authenticateUser,
  authorizeRole([USER_ROLES.ADMIN, USER_ROLES.DELIVERY]),
  updateShippingStatus
);

// @route GET /api/shipping/order/:orderId
// @desc Get shipping information for an order
// @access Private
router.get(ENDPOINTS.SHIPPING_ROUTE.GET_SHIPPING_INFO, authenticateUser, getShippingInfo);

// @route GET /api/shipping/track/:trackingNumber
// @desc Track shipment by tracking number
// @access Public
router.get(ENDPOINTS.SHIPPING_ROUTE.TRACK_SHIPMENT, trackShipment);

// @route GET /api/shipping/delivery/assignments
// @desc Get delivery assignments (Delivery personnel only)
// @access Private (Delivery)
router.get(
  ENDPOINTS.SHIPPING_ROUTE.GET_DELIVERY_ASSIGNMENTS,
  authenticateUser,
  authorizeRole([USER_ROLES.DELIVERY]),
  getDeliveryAssignments
);

export default router;
