import { Request, Response } from "express";
import { AuthenticatedRequest } from "../types/common.type";
import User from "../models/user.model";
import Order from "../models/order.model";
import { Product } from "../models/product.model";
import Review from "../models/review.model";
import Payment from "../models/payment.model";
import { USER_ROLES } from "../constants/user_roles";
import { Op } from "sequelize";

export const getDashboardStats = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const userType = req.user?.userType;

    if (userType !== USER_ROLES.ADMIN) {
      return res.status(403).json({
        success: false,
        message: "Access denied: Admin only",
      });
    }

    // Get statistics for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
      recentUsers,
      recentOrders,
      pendingOrders,
      totalVendors,
      totalDeliveryPersonnel,
    ] = await Promise.all([
      User.count(),
      Product.count(),
      Order.count(),
      Payment.sum("amount", { where: { status: "completed" } }),
      User.count({ where: { createdAt: { [Op.gte]: thirtyDaysAgo } } }),
      Order.count({ where: { createdAt: { [Op.gte]: thirtyDaysAgo } } }),
      Order.count({ where: { status: "pending" } }),
      User.count({ where: { userType: USER_ROLES.VENDOR } }),
      User.count({ where: { userType: USER_ROLES.DELIVERY } }),
    ]);

    res.json({
      success: true,
      message: "Dashboard statistics retrieved successfully",
      data: {
        overview: {
          totalUsers,
          totalProducts,
          totalOrders,
          totalRevenue: totalRevenue || 0,
          totalVendors,
          totalDeliveryPersonnel,
        },
        recent: {
          newUsersLast30Days: recentUsers,
          ordersLast30Days: recentOrders,
          pendingOrders,
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

export const getAllUsers = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const userType = req.user?.userType;
    const {
      page = 1,
      limit = 10,
      userType: filterUserType,
      search,
    } = req.query;

    if (userType !== USER_ROLES.ADMIN) {
      return res.status(403).json({
        success: false,
        message: "Access denied: Admin only",
      });
    }

    const whereClause: any = {};
    if (filterUserType) {
      whereClause.userType = filterUserType;
    }
    if (search) {
      whereClause[Op.or] = [
        { firstName: { [Op.iLike]: `%${search}%` } },
        { lastName: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

    const { count, rows: users } = await User.findAndCountAll({
      where: whereClause,
      attributes: { exclude: ["password"] },
      limit: parseInt(limit as string),
      offset,
      order: [["createdAt", "DESC"]],
    });

    res.json({
      success: true,
      message: "Users retrieved successfully",
      data: {
        users,
        pagination: {
          currentPage: parseInt(page as string),
          totalPages: Math.ceil(count / parseInt(limit as string)),
          totalUsers: count,
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

export const getAllOrders = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const userType = req.user?.userType;
    const { page = 1, limit = 10, status, startDate, endDate } = req.query;

    if (userType !== USER_ROLES.ADMIN) {
      return res.status(403).json({
        success: false,
        message: "Access denied: Admin only",
      });
    }

    const whereClause: any = {};
    if (status) {
      whereClause.status = status;
    }
    if (startDate && endDate) {
      whereClause.createdAt = {
        [Op.between]: [
          new Date(startDate as string),
          new Date(endDate as string),
        ],
      };
    }

    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

    const { count, rows: orders } = await Order.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: "customer",
          attributes: ["id", "firstName", "lastName", "email"],
        },
        {
          model: User,
          as: "vendor",
          attributes: ["id", "firstName", "lastName"],
        },
      ],
      limit: parseInt(limit as string),
      offset,
      order: [["createdAt", "DESC"]],
    });

    res.json({
      success: true,
      message: "Orders retrieved successfully",
      data: {
        orders,
        pagination: {
          currentPage: parseInt(page as string),
          totalPages: Math.ceil(count / parseInt(limit as string)),
          totalOrders: count,
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

export const updateUserStatus = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const userType = req.user?.userType;
    const { userId } = req.params;
    const { isActive } = req.body;

    if (userType !== USER_ROLES.ADMIN) {
      return res.status(403).json({
        success: false,
        message: "Access denied: Admin only",
      });
    }

    const user = await User.findByPk(parseInt(userId));
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.isActive = isActive;
    await user.save();

    res.json({
      success: true,
      message: `User ${isActive ? "activated" : "deactivated"} successfully`,
      data: { userId: user.id, isActive: user.isActive },
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getRevenuereport = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const userType = req.user?.userType;
    const { startDate, endDate, groupBy = "day" } = req.query;

    if (userType !== USER_ROLES.ADMIN) {
      return res.status(403).json({
        success: false,
        message: "Access denied: Admin only",
      });
    }

    let dateFormat = "%Y-%m-%d";
    if (groupBy === "month") {
      dateFormat = "%Y-%m";
    } else if (groupBy === "year") {
      dateFormat = "%Y";
    }

    const whereClause: any = { status: "completed" };
    if (startDate && endDate) {
      whereClause.createdAt = {
        [Op.between]: [
          new Date(startDate as string),
          new Date(endDate as string),
        ],
      };
    }

    const revenueData = await Payment.findAll({
      where: whereClause,
      attributes: [
        [
          Payment.sequelize!.fn(
            "DATE_FORMAT",
            Payment.sequelize!.col("createdAt"),
            dateFormat
          ),
          "date",
        ],
        [
          Payment.sequelize!.fn("SUM", Payment.sequelize!.col("amount")),
          "revenue",
        ],
        [
          Payment.sequelize!.fn("COUNT", Payment.sequelize!.col("id")),
          "transactions",
        ],
      ],
      group: [
        Payment.sequelize!.fn(
          "DATE_FORMAT",
          Payment.sequelize!.col("createdAt"),
          dateFormat
        ),
      ],
      order: [
        [
          Payment.sequelize!.fn(
            "DATE_FORMAT",
            Payment.sequelize!.col("createdAt"),
            dateFormat
          ),
          "ASC",
        ],
      ],
      raw: true,
    });

    res.json({
      success: true,
      message: "Revenue report retrieved successfully",
      data: {
        report: revenueData,
        groupBy,
        period: { startDate, endDate },
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
