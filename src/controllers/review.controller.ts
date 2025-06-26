import { Request, Response } from "express";
import { AuthenticatedRequest } from "../types/common.type";
import Review from "../models/review.model";
import { Product } from "../models/product.model";
import Order from "../models/order.model";
import OrderItem from "../models/orderItem.model";
import User from "../models/user.model";
import sequelize from "../config/db";

export const createReview = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const userId = req.user?.id;
    const { productId, orderId, rating, comment, title } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    // Verify that user has ordered this product
    const orderItem = await OrderItem.findOne({
      where: { productId },
      include: [
        {
          model: Order,
          as: "order",
          where: {
            userId,
            id: orderId,
            status: "delivered",
          },
        },
      ],
    });

    if (!orderItem) {
      return res.status(400).json({
        success: false,
        message: "You can only review products from your delivered orders",
      });
    }

    // Check if user has already reviewed this product
    const existingReview = await Review.findOne({
      where: { userId, productId, orderId },
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this product",
      });
    }

    const review = await Review.create({
      userId,
      productId,
      orderId,
      rating,
      comment,
      title,
      isVerified: false,
      isApproved: true,
      helpfulCount: 0,
    });

    res.status(201).json({
      success: true,
      message: "Review created successfully",
      data: review,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getProductReviews = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 10, rating } = req.query;

    const whereClause: any = { productId: parseInt(productId) };
    if (rating) {
      whereClause.rating = parseInt(rating as string);
    }

    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

    const { count, rows: reviews } = await Review.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "firstName", "lastName", "avatar"],
        },
      ],
      limit: parseInt(limit as string),
      offset,
      order: [["createdAt", "DESC"]],
    });

    // Calculate review statistics
    const stats = await Review.findAll({
      where: { productId: parseInt(productId) },
      attributes: [
        [sequelize.fn("AVG", sequelize.col("rating")), "averageRating"],
        [sequelize.fn("COUNT", sequelize.col("rating")), "totalReviews"],
        [
          sequelize.fn(
            "COUNT",
            sequelize.literal("CASE WHEN rating = 5 THEN 1 END")
          ),
          "fiveStars",
        ],
        [
          sequelize.fn(
            "COUNT",
            sequelize.literal("CASE WHEN rating = 4 THEN 1 END")
          ),
          "fourStars",
        ],
        [
          sequelize.fn(
            "COUNT",
            sequelize.literal("CASE WHEN rating = 3 THEN 1 END")
          ),
          "threeStars",
        ],
        [
          sequelize.fn(
            "COUNT",
            sequelize.literal("CASE WHEN rating = 2 THEN 1 END")
          ),
          "twoStars",
        ],
        [
          sequelize.fn(
            "COUNT",
            sequelize.literal("CASE WHEN rating = 1 THEN 1 END")
          ),
          "oneStar",
        ],
      ],
      raw: true,
    });

    res.json({
      success: true,
      message: "Product reviews retrieved successfully",
      data: {
        reviews,
        statistics: stats[0],
        pagination: {
          currentPage: parseInt(page as string),
          totalPages: Math.ceil(count / parseInt(limit as string)),
          totalReviews: count,
          hasNext: offset + parseInt(limit as string) < count,
          hasPrev: parseInt(page as string) > 1,
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getUserReviews = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const userId = req.user?.id;
    const { page = 1, limit = 10 } = req.query;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

    const { count, rows: reviews } = await Review.findAndCountAll({
      where: { userId },
      include: [
        {
          model: Product,
          as: "product",
          attributes: ["id", "name", "images"],
        },
      ],
      limit: parseInt(limit as string),
      offset,
      order: [["createdAt", "DESC"]],
    });

    res.json({
      success: true,
      message: "User reviews retrieved successfully",
      data: {
        reviews,
        pagination: {
          currentPage: parseInt(page as string),
          totalPages: Math.ceil(count / parseInt(limit as string)),
          totalReviews: count,
          hasNext: offset + parseInt(limit as string) < count,
          hasPrev: parseInt(page as string) > 1,
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateReview = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const userId = req.user?.id;
    const { reviewId } = req.params;
    const { rating, comment, title } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const review = await Review.findOne({
      where: { id: parseInt(reviewId), userId },
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found or unauthorized",
      });
    }

    if (rating !== undefined) review.rating = rating;
    if (comment !== undefined) review.comment = comment;
    if (title !== undefined) review.title = title;

    await review.save();

    res.json({
      success: true,
      message: "Review updated successfully",
      data: review,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteReview = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const userId = req.user?.id;
    const { reviewId } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const review = await Review.findOne({
      where: { id: parseInt(reviewId), userId },
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found or unauthorized",
      });
    }

    await review.destroy();

    res.json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
