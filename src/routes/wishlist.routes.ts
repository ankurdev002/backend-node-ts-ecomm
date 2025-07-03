import { Router } from "express";
import {
  addItemToWishlist,
  removeItemFromWishlist,
  removeItemByProductId,
  getWishlist,
  checkWishlistItem,
  getWishlistItemCount,
  clearUserWishlist,
  moveToCart,
} from "../controllers/wishlist.controller";
import { authenticateUser } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import {
  addToWishlistSchema,
  removeFromWishlistSchema,
  removeByProductIdSchema,
  checkWishlistItemSchema,
  getWishlistSchema,
} from "../schema/wishlist.schema";
import { ENDPOINTS } from "../constants/endpoint";

const router = Router();

// All wishlist routes require authentication
router.use(authenticateUser);

// @route POST /api/wishlist/add
// @desc Add item to wishlist
// @access Private
router.post(
  ENDPOINTS.WISHLIST_ROUTE.ADD_ITEM,
  validate(addToWishlistSchema),
  addItemToWishlist
);

// @route GET /api/wishlist
// @desc Get user wishlist
// @access Private
router.get(ENDPOINTS.WISHLIST_ROUTE.GET_WISHLIST, getWishlist);

// @route GET /api/wishlist/count
// @desc Get wishlist item count
// @access Private
router.get(ENDPOINTS.WISHLIST_ROUTE.GET_COUNT, getWishlistItemCount);

// @route GET /api/wishlist/check/:productId
// @desc Check if product is in wishlist
// @access Private
router.get(ENDPOINTS.WISHLIST_ROUTE.CHECK_ITEM, checkWishlistItem);

// @route DELETE /api/wishlist/:wishlistItemId
// @desc Remove item from wishlist by wishlist item ID
// @access Private
router.delete(
  ENDPOINTS.WISHLIST_ROUTE.REMOVE_ITEM,
  removeItemFromWishlist
);

// @route DELETE /api/wishlist/product/:productId
// @desc Remove item from wishlist by product ID
// @access Private
router.delete(
  ENDPOINTS.WISHLIST_ROUTE.REMOVE_BY_PRODUCT,
  removeItemByProductId
);

// @route POST /api/wishlist/:wishlistItemId/move-to-cart
// @desc Move wishlist item to cart
// @access Private
router.post(
  ENDPOINTS.WISHLIST_ROUTE.MOVE_TO_CART,
  moveToCart
);

// @route DELETE /api/wishlist
// @desc Clear user wishlist
// @access Private
router.delete(ENDPOINTS.WISHLIST_ROUTE.CLEAR_WISHLIST, clearUserWishlist);

export default router;
