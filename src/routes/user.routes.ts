import express from "express";
import {
  getAllProductsList,
  loginUser,
  registerUser,
  resendOtp,
  verifyOtp,
} from "../controllers/user.controller";
import paginate from "../middleware/pagination.middleware";
import { Product } from "../models/product.model";
import {
  rateLimitLogin,
  rateLimitOtp,
} from "../middleware/rateLimit.middleware";
import { body } from "express-validator";

const router = express.Router();

router.post(
  "/register",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Valid email required"),
    body("password").isLength({ min: 5 }).withMessage("Password min 5 chars"),
    body("userType").isIn(["admin", "vendor", "delivery", "normal"]),
  ],
  registerUser
);
router.post(
  "/login",
  [
    rateLimitLogin,
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Valid email required"),
    body("password").isLength({ min: 5 }).withMessage("Password min 5 chars"),
  ],
  loginUser
);
router.post(
  "/verify",
  [
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Valid email required"),
    body("otp")
      .isLength({ min: 6, max: 6 })
      .withMessage("OTP must be 6 digits"),
  ],
  verifyOtp
);
router.post(
  "/otp-request",
  [
    rateLimitOtp,
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Valid email required"),
  ],
  resendOtp
);
router.get(
  "/all-products-list",
  paginate(Product, [], { isActive: true }),
  getAllProductsList
);

export default router;
