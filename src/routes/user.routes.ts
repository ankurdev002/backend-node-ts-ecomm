import express from "express";
import { ENDPOINTS } from "../constants/endpoint";
import {
  getAllProductsList,
  loginUser,
  registerUser,
  resendOtp,
  verifyOtp,
  getProfile,
  updateProfile,
  logoutUser,
} from "../controllers/user.controller";
import paginate from "../middleware/pagination.middleware";
import { rateLimitLogin } from "../middleware/rateLimit.middleware";
import { validate } from "../middleware/validate.middleware";
import { authenticateUser } from "../middleware/auth.middleware";
import { Product } from "../models/product.model";
import {
  loginUserSchema,
  registerUserSchema,
  resendOtpSchema,
  verifyOtpSchema,
} from "../schema/login_register.schema";

const router = express.Router();

router.post(
  ENDPOINTS.USER_ROUTE.REGISTER,
  rateLimitLogin,
  validate(registerUserSchema),
  registerUser
);
router.post(
  ENDPOINTS.USER_ROUTE.LOGIN,
  rateLimitLogin,
  validate(loginUserSchema),
  loginUser
);
router.post(ENDPOINTS.USER_ROUTE.VERIFY, validate(verifyOtpSchema), verifyOtp);
router.post(
  ENDPOINTS.USER_ROUTE.OTP_REQUEST,
  validate(resendOtpSchema),
  resendOtp
);

// Profile routes
router.get(ENDPOINTS.USER_ROUTE.USER_PROFILE, authenticateUser, getProfile);
router.put(ENDPOINTS.USER_ROUTE.USER_PROFILE, authenticateUser, updateProfile);
router.post(ENDPOINTS.USER_ROUTE.LOGOUT, authenticateUser, logoutUser);

router.get(
  ENDPOINTS.USER_ROUTE.ALL_PRODUCT_LIST,
  paginate(Product, [], { isActive: true }),
  getAllProductsList
);

export default router;
