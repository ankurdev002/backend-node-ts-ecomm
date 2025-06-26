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

const router = Router();

// @route PUT /api/shipping/:shippingId/status
// @desc Update shipping status (Admin/Delivery only)
// @access Private (Admin/Delivery)
router.put(
  "/:shippingId/status",
  authenticateUser,
  authorizeRole([USER_ROLES.ADMIN, USER_ROLES.DELIVERY]),
  updateShippingStatus
);

// @route GET /api/shipping/order/:orderId
// @desc Get shipping information for an order
// @access Private
router.get("/order/:orderId", authenticateUser, getShippingInfo);

// @route GET /api/shipping/track/:trackingNumber
// @desc Track shipment by tracking number
// @access Public
router.get("/track/:trackingNumber", trackShipment);

// @route GET /api/shipping/delivery/assignments
// @desc Get delivery assignments (Delivery personnel only)
// @access Private (Delivery)
router.get(
  "/delivery/assignments",
  authenticateUser,
  authorizeRole([USER_ROLES.DELIVERY]),
  getDeliveryAssignments
);

export default router;
