import { Router } from "express";
import {
  getDashboardStats,
  getAllUsers,
  getAllOrders,
  updateUserStatus,
  getRevenuereport,
} from "../controllers/admin.controller";
import { authenticateUser } from "../middleware/auth.middleware";
import { authorizeRole } from "../middleware/role.middleware";
import { USER_ROLES } from "../constants/user_roles";

const router = Router();

// All admin routes require authentication and admin role
router.use(authenticateUser);
router.use(authorizeRole([USER_ROLES.ADMIN]));

// @route GET /api/admin/dashboard
// @desc Get admin dashboard statistics
// @access Private (Admin)
router.get("/dashboard", getDashboardStats);

// @route GET /api/admin/users
// @desc Get all users with filters and pagination
// @access Private (Admin)
router.get("/users", getAllUsers);

// @route GET /api/admin/orders
// @desc Get all orders with filters and pagination
// @access Private (Admin)
router.get("/orders", getAllOrders);

// @route PUT /api/admin/users/:userId/status
// @desc Update user status (activate/deactivate)
// @access Private (Admin)
router.put("/users/:userId/status", updateUserStatus);

// @route GET /api/admin/reports/revenue
// @desc Get revenue report
// @access Private (Admin)
router.get("/reports/revenue", getRevenuereport);

export default router;
