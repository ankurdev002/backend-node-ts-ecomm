import { Router } from "express";
import {
  createNewCoupon,
  getAllCoupons,
  getCoupon,
  getCouponInfo,
  updateExistingCoupon,
  deleteCouponById,
  validateCouponCode,
  applyCouponToOrder,
  getAvailableCouponsForUser,
  getCouponStats,
  getUserCouponUsageHistory,
} from "../controllers/coupon.controller";
import { authenticateUser } from "../middleware/auth.middleware";
import { authorizeRole } from "../middleware/role.middleware";
import { validate } from "../middleware/validate.middleware";
import { USER_ROLES } from "../constants/user_roles";
import {
  createCouponSchema,
  updateCouponSchema,
  validateCouponSchema,
  applyCouponSchema,
  getCouponSchema,
  getCouponsSchema,
  getCouponByCodeSchema,
} from "../schema/coupon.schema";
import { ENDPOINTS } from "../constants/endpoint";

const router = Router();

// Public route for getting coupon info by code
router.get(ENDPOINTS.COUPON_ROUTE.GET_COUPON_BY_CODE, getCouponInfo);

// Protected routes requiring authentication
router.use(authenticateUser);

// User routes - Available to all authenticated users
router.post(
  ENDPOINTS.COUPON_ROUTE.VALIDATE_COUPON,
  validate(validateCouponSchema),
  validateCouponCode
);

router.post(
  ENDPOINTS.COUPON_ROUTE.APPLY_COUPON,
  validate(applyCouponSchema),
  applyCouponToOrder
);

router.get(
  ENDPOINTS.COUPON_ROUTE.GET_AVAILABLE_COUPONS,
  getAvailableCouponsForUser
);

router.get(ENDPOINTS.COUPON_ROUTE.GET_USER_HISTORY, getUserCouponUsageHistory);

// Admin-only routes
router.post(
  ENDPOINTS.COUPON_ROUTE.CREATE_COUPON,
  authorizeRole([USER_ROLES.ADMIN]),
  validate(createCouponSchema),
  createNewCoupon
);

router.get(
  ENDPOINTS.COUPON_ROUTE.GET_COUPONS,
  authorizeRole([USER_ROLES.ADMIN]),
  getAllCoupons
);

router.get(
  ENDPOINTS.COUPON_ROUTE.GET_COUPON_BY_ID,
  authorizeRole([USER_ROLES.ADMIN]),
  getCoupon
);

router.put(
  ENDPOINTS.COUPON_ROUTE.UPDATE_COUPON,
  authorizeRole([USER_ROLES.ADMIN]),
  validate(updateCouponSchema),
  updateExistingCoupon
);

router.delete(
  ENDPOINTS.COUPON_ROUTE.DELETE_COUPON,
  authorizeRole([USER_ROLES.ADMIN]),
  deleteCouponById
);

router.get(
  ENDPOINTS.COUPON_ROUTE.GET_COUPON_STATS,
  authorizeRole([USER_ROLES.ADMIN]),
  getCouponStats
);

export default router;
