import express from "express";
import {
  registerUser,
  loginUser,
  verifyOtp,
  resendOtp,
  getAllProductsList,
} from "../controllers/user.controller";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verify", verifyOtp);
router.post("/otp-request", resendOtp);
router.get("/all-products-list", getAllProductsList);

export default router;
