import { Router } from "express";
import {
  addItemToCart,
  removeItemFromCart,
  updateCartItemQuantity,
  getUserCart,
  clearUserCart,
  validateCart,
} from "../controllers/cart.controller";
import { authenticateUser } from "../middleware/auth.middleware";

const router = Router();

// All cart routes require authentication
router.use(authenticateUser);

// @route POST /api/cart/add
// @desc Add item to cart
// @access Private
router.post("/add", addItemToCart);

// @route GET /api/cart
// @desc Get user cart
// @access Private
router.get("/", getUserCart);

// @route PUT /api/cart/:cartItemId
// @desc Update cart item quantity
// @access Private
router.put("/:cartItemId", updateCartItemQuantity);

// @route DELETE /api/cart/:cartItemId
// @desc Remove item from cart
// @access Private
router.delete("/:cartItemId", removeItemFromCart);

// @route DELETE /api/cart
// @desc Clear user cart
// @access Private
router.delete("/", clearUserCart);

// @route GET /api/cart/validate
// @desc Validate cart stock
// @access Private
router.get("/validate", validateCart);

export default router;
