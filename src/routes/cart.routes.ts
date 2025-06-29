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
import { ENDPOINTS } from "../constants/endpoint";

const router = Router();

// All cart routes require authentication
router.use(authenticateUser);

// @route POST /api/cart/add
// @desc Add item to cart
// @access Private
router.post(ENDPOINTS.CART_ROUTE.ADD_ITEM, addItemToCart);

// @route GET /api/cart
// @desc Get user cart
// @access Private
router.get(ENDPOINTS.CART_ROUTE.GET_CART, getUserCart);

// @route PUT /api/cart/:cartItemId
// @desc Update cart item quantity
// @access Private
router.put(ENDPOINTS.CART_ROUTE.UPDATE_CART_ITEM, updateCartItemQuantity);

// @route DELETE /api/cart/:cartItemId
// @desc Remove item from cart
// @access Private
router.delete(ENDPOINTS.CART_ROUTE.REMOVE_ITEM, removeItemFromCart);

// @route DELETE /api/cart
// @desc Clear user cart
// @access Private
router.delete(ENDPOINTS.CART_ROUTE.CLEAR_CART, clearUserCart);

// @route GET /api/cart/validate
// @desc Validate cart stock
// @access Private
router.get(ENDPOINTS.CART_ROUTE.VALIDATE_CART, validateCart);

export default router;
