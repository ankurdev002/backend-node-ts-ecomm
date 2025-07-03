import Coupon from "../models/coupon.model";
import { Product } from "../models/product.model";
import { Category } from "../models/category.model";
import { Op, Transaction, QueryTypes } from "sequelize";
import sequelize from "../config/db";

// Create a new coupon (Admin only)
export const createCoupon = async (couponData: any) => {
  // Check if coupon code already exists
  const existingCoupon = await Coupon.findOne({
    where: { code: couponData.code },
  });

  if (existingCoupon) {
    throw new Error("Coupon code already exists");
  }

  // Create the coupon
  const coupon = await Coupon.create(couponData);
  return coupon;
};

// Get all coupons with pagination and filters (Admin only)
export const getCoupons = async (
  page: number = 1,
  limit: number = 10,
  isActive?: boolean,
  type?: string
) => {
  const offset = (page - 1) * limit;

  const whereConditions: any = {};

  if (isActive !== undefined) {
    whereConditions.isActive = isActive;
  }

  if (type) {
    whereConditions.type = type;
  }

  const { rows: coupons, count: totalItems } = await Coupon.findAndCountAll({
    where: whereConditions,
    order: [["createdAt", "DESC"]],
    limit,
    offset,
  });

  const totalPages = Math.ceil(totalItems / limit);

  return {
    coupons,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems,
      itemsPerPage: limit,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
};

// Get coupon by ID (Admin only)
export const getCouponById = async (couponId: number) => {
  const coupon = await Coupon.findByPk(couponId);

  if (!coupon) {
    throw new Error("Coupon not found");
  }

  return coupon;
};

// Get coupon by code (Public - for validation)
export const getCouponByCode = async (code: string) => {
  const coupon = await Coupon.findOne({
    where: { code: code.toUpperCase() },
  });

  if (!coupon) {
    throw new Error("Coupon not found");
  }

  return coupon;
};

// Update coupon (Admin only)
export const updateCoupon = async (couponId: number, updateData: any) => {
  const coupon = await Coupon.findByPk(couponId);

  if (!coupon) {
    throw new Error("Coupon not found");
  }

  // If updating dates, validate them
  if (updateData.validFrom && updateData.validUntil) {
    const validFrom = new Date(updateData.validFrom);
    const validUntil = new Date(updateData.validUntil);

    if (validFrom >= validUntil) {
      throw new Error("Valid from date must be before valid until date");
    }
  }

  await coupon.update(updateData);
  return coupon;
};

// Delete coupon (Admin only)
export const deleteCoupon = async (couponId: number) => {
  const coupon = await Coupon.findByPk(couponId);

  if (!coupon) {
    throw new Error("Coupon not found");
  }

  await coupon.destroy();
  return { message: "Coupon deleted successfully" };
};

// Validate coupon code for order
export const validateCoupon = async (
  code: string,
  orderAmount: number,
  productIds?: number[],
  userId?: number
) => {
  const coupon = await getCouponByCode(code);

  // Check if coupon is valid
  if (!coupon.isValid()) {
    throw new Error("Coupon is not valid or has expired");
  }

  // Check if coupon can be used
  if (!coupon.canBeUsed()) {
    throw new Error("Coupon usage limit has been exceeded");
  }

  // Check minimum order amount
  if (orderAmount < coupon.minOrderAmount) {
    throw new Error(
      `Minimum order amount of $${coupon.minOrderAmount} is required to use this coupon`
    );
  }

  // Check product applicability if specified
  if (productIds && productIds.length > 0) {
    const isApplicable = productIds.some((productId) =>
      coupon.isApplicableToProduct(productId)
    );

    if (!isApplicable) {
      throw new Error("Coupon is not applicable to the selected products");
    }
  }

  // Check user usage limit if userId is provided
  if (userId && coupon.userLimit > 0) {
    const userUsageCount = await getUserCouponUsageCount(userId, coupon.id);

    if (userUsageCount >= coupon.userLimit) {
      throw new Error("You have reached the usage limit for this coupon");
    }
  }

  // Calculate discount
  const discountAmount = coupon.calculateDiscount(orderAmount);

  return {
    isValid: true,
    coupon: {
      id: coupon.id,
      code: coupon.code,
      name: coupon.name,
      description: coupon.description,
      type: coupon.type,
      value: coupon.value,
    },
    discountAmount,
    finalAmount: orderAmount - discountAmount,
  };
};

// Apply coupon to order
export const applyCoupon = async (
  code: string,
  orderId: number,
  userId: number,
  orderAmount: number,
  productIds?: number[]
) => {
  const transaction: Transaction = await sequelize.transaction();

  try {
    // Validate coupon
    const validationResult = await validateCoupon(
      code,
      orderAmount,
      productIds,
      userId
    );

    const coupon = await getCouponByCode(code);

    // Create coupon usage record
    await createCouponUsage(
      coupon.id,
      userId,
      orderId,
      validationResult.discountAmount,
      transaction
    );

    // Increment coupon usage count
    await coupon.incrementUsage();

    await transaction.commit();

    return {
      success: true,
      message: "Coupon applied successfully",
      discountAmount: validationResult.discountAmount,
      finalAmount: validationResult.finalAmount,
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

// Get available coupons for user
export const getAvailableCoupons = async (
  userId: number,
  orderAmount: number,
  productIds?: number[]
) => {
  const currentDate = new Date();

  // Get all active coupons that are currently valid
  const coupons = await Coupon.findAll({
    where: {
      isActive: true,
      validFrom: { [Op.lte]: currentDate },
      validUntil: { [Op.gte]: currentDate },
      usedCount: { [Op.lt]: sequelize.col("usageLimit") },
    },
    order: [["value", "DESC"]],
  });

  const availableCoupons = [];

  for (const coupon of coupons) {
    try {
      // Check if user can use this coupon
      if (coupon.userLimit > 0) {
        const userUsageCount = await getUserCouponUsageCount(userId, coupon.id);
        if (userUsageCount >= coupon.userLimit) {
          continue;
        }
      }

      // Check if coupon is applicable to the order
      if (orderAmount >= coupon.minOrderAmount) {
        // Check product applicability
        if (productIds && productIds.length > 0) {
          const isApplicable = productIds.some((productId) =>
            coupon.isApplicableToProduct(productId)
          );

          if (!isApplicable) {
            continue;
          }
        }

        const discountAmount = coupon.calculateDiscount(orderAmount);

        availableCoupons.push({
          id: coupon.id,
          code: coupon.code,
          name: coupon.name,
          description: coupon.description,
          type: coupon.type,
          value: coupon.value,
          discountAmount,
          minOrderAmount: coupon.minOrderAmount,
          maxDiscountAmount: coupon.maxDiscountAmount,
          validUntil: coupon.validUntil,
        });
      }
    } catch (error) {
      // Skip invalid coupons
      continue;
    }
  }

  return availableCoupons;
};

// Get coupon usage statistics (Admin only)
export const getCouponUsageStats = async (couponId: number) => {
  const coupon = await getCouponById(couponId);

  // Get detailed usage statistics
  const usageStats = await sequelize.query(
    `
    SELECT 
      COUNT(*) as total_uses,
      COUNT(DISTINCT "userId") as unique_users,
      SUM("discountAmount") as total_discount_given,
      AVG("discountAmount") as avg_discount_amount,
      DATE_TRUNC('day', "usedAt") as date,
      COUNT(*) as daily_uses
    FROM coupon_usage 
    WHERE "couponId" = :couponId
    GROUP BY DATE_TRUNC('day', "usedAt")
    ORDER BY date DESC
    `,
    {
      replacements: { couponId },
      type: QueryTypes.SELECT,
    }
  );

  return {
    coupon: {
      id: coupon.id,
      code: coupon.code,
      name: coupon.name,
      usageLimit: coupon.usageLimit,
      usedCount: coupon.usedCount,
      remainingUses: coupon.usageLimit - coupon.usedCount,
    },
    usageStats,
  };
};

// Helper function to get user coupon usage count
export const getUserCouponUsageCount = async (
  userId: number,
  couponId: number
) => {
  const result = await sequelize.query(
    `SELECT COUNT(*) as count FROM coupon_usage WHERE "userId" = :userId AND "couponId" = :couponId`,
    {
      replacements: { userId, couponId },
      type: QueryTypes.SELECT,
    }
  );

  return parseInt((result[0] as any).count);
};

// Helper function to create coupon usage record
export const createCouponUsage = async (
  couponId: number,
  userId: number,
  orderId: number,
  discountAmount: number,
  transaction?: Transaction
) => {
  return await sequelize.query(
    `
    INSERT INTO coupon_usage ("couponId", "userId", "orderId", "discountAmount", "usedAt")
    VALUES (:couponId, :userId, :orderId, :discountAmount, NOW())
    `,
    {
      replacements: {
        couponId,
        userId,
        orderId,
        discountAmount,
      },
      type: QueryTypes.INSERT,
      transaction,
    }
  );
};

// Get user's coupon usage history
export const getUserCouponHistory = async (
  userId: number,
  page: number = 1,
  limit: number = 10
) => {
  const offset = (page - 1) * limit;

  const result = await sequelize.query(
    `
    SELECT 
      cu.*,
      c.code,
      c.name,
      c.type,
      c.value
    FROM coupon_usage cu
    JOIN coupons c ON cu."couponId" = c.id
    WHERE cu."userId" = :userId
    ORDER BY cu."usedAt" DESC
    LIMIT :limit OFFSET :offset
    `,
    {
      replacements: { userId, limit, offset },
      type: QueryTypes.SELECT,
    }
  );

  const countResult = await sequelize.query(
    `SELECT COUNT(*) as count FROM coupon_usage WHERE "userId" = :userId`,
    {
      replacements: { userId },
      type: QueryTypes.SELECT,
    }
  );

  const totalItems = parseInt((countResult[0] as any).count);
  const totalPages = Math.ceil(totalItems / limit);

  return {
    usageHistory: result,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems,
      itemsPerPage: limit,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
};
