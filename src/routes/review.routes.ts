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

const router = Router();

// @route POST /api/reviews
// @desc Create a product review
// @access Private
router.post("/", authenticateUser, validate(createReviewSchema), createReview);

// @route GET /api/reviews/product/:productId
// @desc Get all reviews for a product
// @access Public
router.get(
  "/product/:productId",
  validate(getReviewsSchema),
  getProductReviews
);

// @route GET /api/reviews/user
// @desc Get all reviews by the authenticated user
// @access Private
router.get("/user", authenticateUser, getUserReviews);

// @route PUT /api/reviews/:reviewId
// @desc Update a review
// @access Private
router.put(
  "/:reviewId",
  authenticateUser,
  validate(updateReviewSchema),
  updateReview
);

// @route DELETE /api/reviews/:reviewId
// @desc Delete a review
// @access Private
router.delete("/:reviewId", authenticateUser, deleteReview);

export default router;
