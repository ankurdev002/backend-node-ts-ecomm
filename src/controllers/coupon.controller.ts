import { Request, Response } from "express";
import { AuthenticatedRequest } from "../types/common.type";
import {
  createCoupon,
  getCoupons,
  getCouponById,
  getCouponByCode,
  updateCoupon,
  deleteCoupon,
  validateCoupon,
  applyCoupon,
  getAvailableCoupons,
  getCouponUsageStats,
  getUserCouponHistory,
} from "../services/coupon.service";

// Create coupon (Admin only)
export const createNewCoupon = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const couponData = req.body;

    const coupon = await createCoupon(couponData);

    res.status(201).json({
      success: true,
      message: "Coupon created successfully",
      data: coupon,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all coupons (Admin only)
export const getAllCoupons = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const isActive =
      req.query.isActive === "true"
        ? true
        : req.query.isActive === "false"
        ? false
        : undefined;
    const type = req.query.type as string;

    const result = await getCoupons(page, limit, isActive, type);

    res.json({
      success: true,
      message: "Coupons retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get coupon by ID (Admin only)
export const getCoupon = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const { couponId } = req.params;

    const coupon = await getCouponById(parseInt(couponId));

    res.json({
      success: true,
      message: "Coupon retrieved successfully",
      data: coupon,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// Get coupon by code (Public)
export const getCouponInfo = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { code } = req.params;

    const coupon = await getCouponByCode(code);

    // Return only public information
    res.json({
      success: true,
      message: "Coupon information retrieved successfully",
      data: {
        id: coupon.id,
        code: coupon.code,
        name: coupon.name,
        description: coupon.description,
        type: coupon.type,
        value: coupon.value,
        minOrderAmount: coupon.minOrderAmount,
        maxDiscountAmount: coupon.maxDiscountAmount,
        validUntil: coupon.validUntil,
        isActive: coupon.isActive,
      },
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// Update coupon (Admin only)
export const updateExistingCoupon = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const { couponId } = req.params;
    const updateData = req.body;

    const coupon = await updateCoupon(parseInt(couponId), updateData);

    res.json({
      success: true,
      message: "Coupon updated successfully",
      data: coupon,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete coupon (Admin only)
export const deleteCouponById = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const { couponId } = req.params;

    const result = await deleteCoupon(parseInt(couponId));

    res.json({
      success: true,
      message: result.message,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// Validate coupon code
export const validateCouponCode = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const userId = req.user?.id;
    const { code, orderAmount, productIds } = req.body;

    const result = await validateCoupon(code, orderAmount, productIds, userId);

    res.json({
      success: true,
      message: "Coupon validation completed",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Apply coupon to order
export const applyCouponToOrder = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const userId = req.user?.id;
    const { code, orderId } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    // Note: In a real implementation, you'd get orderAmount and productIds from the order
    // For now, we'll assume they're provided or fetched from the order
    const result = await applyCoupon(code, orderId, userId, 0, []); // Placeholder values

    res.json({
      success: true,
      message: result.message,
      data: {
        discountAmount: result.discountAmount,
        finalAmount: result.finalAmount,
      },
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get available coupons for user
export const getAvailableCouponsForUser = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const userId = req.user?.id;
    const orderAmount = parseFloat(req.query.orderAmount as string) || 0;
    const productIds = req.query.productIds
      ? (req.query.productIds as string).split(",").map((id) => parseInt(id))
      : undefined;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const coupons = await getAvailableCoupons(userId, orderAmount, productIds);

    res.json({
      success: true,
      message: "Available coupons retrieved successfully",
      data: coupons,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get coupon usage statistics (Admin only)
export const getCouponStats = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const { couponId } = req.params;

    const stats = await getCouponUsageStats(parseInt(couponId));

    res.json({
      success: true,
      message: "Coupon usage statistics retrieved successfully",
      data: stats,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// Get user coupon usage history
export const getUserCouponUsageHistory = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const userId = req.user?.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const result = await getUserCouponHistory(userId, page, limit);

    res.json({
      success: true,
      message: "Coupon usage history retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
