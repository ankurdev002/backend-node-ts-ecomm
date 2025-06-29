import { Router } from "express";
import {
  createReview,
  getProductReviews,
  getUserReviews,
  updateReview,
  deleteReview,
} from "../controllers/review.controller";
import { authenticateUser } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import {
  createReviewSchema,
  updateReviewSchema,
  getReviewsSchema,
} from "../schema/review.schema";
import { ENDPOINTS } from "../constants/endpoint";

const router = Router();

// @route POST /api/reviews
// @desc Create a product review
// @access Private
router.post(ENDPOINTS.REVIEW_ROUTE.CREATE_REVIEW, authenticateUser, validate(createReviewSchema), createReview);

// @route GET /api/reviews/product/:productId
// @desc Get all reviews for a product
// @access Public
router.get(
  ENDPOINTS.REVIEW_ROUTE.GET_REVIEWS,
  validate(getReviewsSchema),
  getProductReviews
);

// @route GET /api/reviews/user
// @desc Get all reviews by the authenticated user
// @access Private
router.get(ENDPOINTS.REVIEW_ROUTE.GET_USER_REVIEWS, authenticateUser, getUserReviews);

// @route PUT /api/reviews/:reviewId
// @desc Update a review
// @access Private
router.put(
  ENDPOINTS.REVIEW_ROUTE.UPDATE_REVIEW,
  authenticateUser,
  validate(updateReviewSchema),
  updateReview
);

// @route DELETE /api/reviews/:reviewId
// @desc Delete a review
// @access Private
router.delete(ENDPOINTS.REVIEW_ROUTE.DELETE_REVIEW, authenticateUser, deleteReview);

export default router;
