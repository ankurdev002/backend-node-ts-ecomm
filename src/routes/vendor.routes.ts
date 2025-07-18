import { Router } from "express";
import {
  getVendorDashboard,
  getVendorProducts,
  getVendorOrders,
  updateOrderStatus,
  getInventoryReport,
} from "../controllers/vendor.controller";
import { authenticateUser } from "../middleware/auth.middleware";
import { authorizeRole } from "../middleware/role.middleware";
import { USER_ROLES } from "../constants/user_roles";
import { ENDPOINTS } from "../constants/endpoint";

const router = Router();

// All vendor routes require authentication and vendor role
router.use(authenticateUser);
router.use(authorizeRole([USER_ROLES.VENDOR]));

// @route GET /api/vendor/dashboard
// @desc Get vendor dashboard statistics
// @access Private (Vendor)
router.get(ENDPOINTS.VENDOR_ROUTE.GET_VENDOR_DASHBOARD, getVendorDashboard);

// @route GET /api/vendor/products
// @desc Get vendor products with filters and pagination
// @access Private (Vendor)
router.get(ENDPOINTS.VENDOR_ROUTE.GET_VENDOR_PRODUCTS, getVendorProducts);

// @route GET /api/vendor/orders
// @desc Get vendor orders with filters and pagination
// @access Private (Vendor)
router.get(ENDPOINTS.VENDOR_ROUTE.GET_VENDOR_ORDERS, getVendorOrders);

// @route PUT /api/vendor/orders/:orderId/status
// @desc Update order status
// @access Private (Vendor)
router.put(ENDPOINTS.VENDOR_ROUTE.UPDATE_ORDER_STATUS, updateOrderStatus);

// @route GET /api/vendor/inventory/report
// @desc Get inventory report
// @access Private (Vendor)
router.get(ENDPOINTS.VENDOR_ROUTE.GET_INVENTORY_REPORT, getInventoryReport);

export default router;
