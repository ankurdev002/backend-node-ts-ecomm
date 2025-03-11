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

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verify", verifyOtp);
router.post("/otp-request", resendOtp);
router.get(
  "/all-products-list",
  paginate(Product, [], { isActive: true }),
  getAllProductsList
);

export default router;
