import { Request, Response } from "express";
import { AuthenticatedRequest } from "../types/common.type";
import { Product } from "../models/product.model";
import Order from "../models/order.model";
import OrderItem from "../models/orderItem.model";
import Inventory from "../models/inventory.model";
import Payment from "../models/payment.model";
import User from "../models/user.model";
import { USER_ROLES } from "../constants/user_roles";
import { Op } from "sequelize";

export const getVendorDashboard = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const userId = req.user?.id;
    const userType = req.user?.userType;

    if (!userId || userType !== USER_ROLES.VENDOR) {
      return res.status(403).json({
        success: false,
        message: "Access denied: Vendor only",
      });
    }

    // Get vendor statistics
    const [
      totalProducts,
      activeProducts,
      totalOrders,
      pendingOrders,
      totalRevenue,
      lowStockProducts,
    ] = await Promise.all([
      Product.count({ where: { userId } }),
      Product.count({ where: { userId, isActive: true } }),
      Order.count({ where: { vendorId: userId } }),
      Order.count({ where: { vendorId: userId, status: "pending" } }),
      Payment.findAll({
        include: [
          {
            model: Order,
            as: "order",
            where: { vendorId: userId },
            required: true,
          },
        ],
        where: { status: "completed" },
        attributes: [
          [
            Payment.sequelize!.fn("SUM", Payment.sequelize!.col("amount")),
            "total",
          ],
        ],
        raw: true,
      }).then((result: any) => result[0]?.total || 0),
      Inventory.count({
        include: [
          {
            model: Product,
            as: "product",
            where: { userId },
            required: true,
          },
        ],
        where: {
          quantity: { [Op.lte]: Inventory.sequelize!.col("reorderLevel") },
        },
      }),
    ]);

    res.json({
      success: true,
      message: "Vendor dashboard retrieved successfully",
      data: {
        products: {
          total: totalProducts,
          active: activeProducts,
          lowStock: lowStockProducts,
        },
        orders: {
          total: totalOrders,
          pending: pendingOrders,
        },
        revenue: {
          total: totalRevenue || 0,
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

export const getVendorProducts = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const userId = req.user?.id;
    const userType = req.user?.userType;
    const { page = 1, limit = 10, category, status, search } = req.query;

    if (!userId || userType !== USER_ROLES.VENDOR) {
      return res.status(403).json({
        success: false,
        message: "Access denied: Vendor only",
      });
    }

    const whereClause: any = { userId };
    if (category) {
      whereClause.categoryId = category;
    }
    if (status) {
      whereClause.isActive = status === "active";
    }
    if (search) {
      whereClause.name = { [Op.iLike]: `%${search}%` };
    }

    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

    const { count, rows: products } = await Product.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Inventory,
          as: "inventory",
        },
      ],
      limit: parseInt(limit as string),
      offset,
      order: [["createdAt", "DESC"]],
    });

    res.json({
      success: true,
      message: "Vendor products retrieved successfully",
      data: {
        products,
        pagination: {
          currentPage: parseInt(page as string),
          totalPages: Math.ceil(count / parseInt(limit as string)),
          totalProducts: count,
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

export const getVendorOrders = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const userId = req.user?.id;
    const userType = req.user?.userType;
    const { page = 1, limit = 10, status, startDate, endDate } = req.query;

    if (!userId || userType !== USER_ROLES.VENDOR) {
      return res.status(403).json({
        success: false,
        message: "Access denied: Vendor only",
      });
    }

    const whereClause: any = { vendorId: userId };
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
          model: OrderItem,
          as: "items",
          include: [
            {
              model: Product,
              as: "product",
              attributes: ["id", "name", "images"],
            },
          ],
        },
      ],
      limit: parseInt(limit as string),
      offset,
      order: [["createdAt", "DESC"]],
    });

    res.json({
      success: true,
      message: "Vendor orders retrieved successfully",
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

export const updateOrderStatus = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const userId = req.user?.id;
    const userType = req.user?.userType;
    const { orderId } = req.params;
    const { status } = req.body;

    if (!userId || userType !== USER_ROLES.VENDOR) {
      return res.status(403).json({
        success: false,
        message: "Access denied: Vendor only",
      });
    }

    const order = await Order.findOne({
      where: { id: parseInt(orderId), vendorId: userId },
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found or unauthorized",
      });
    }

    // Validate status transition
    const allowedTransitions: Record<string, string[]> = {
      pending: ["confirmed", "cancelled"],
      confirmed: ["processing", "cancelled"],
      processing: ["shipped"],
      shipped: ["delivered"],
    };

    const currentStatus = order.status;
    if (!allowedTransitions[currentStatus]?.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot transition from ${currentStatus} to ${status}`,
      });
    }

    order.status = status;
    await order.save();

    res.json({
      success: true,
      message: "Order status updated successfully",
      data: order,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getInventoryReport = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const userId = req.user?.id;
    const userType = req.user?.userType;

    if (!userId || userType !== USER_ROLES.VENDOR) {
      return res.status(403).json({
        success: false,
        message: "Access denied: Vendor only",
      });
    }

    const inventory = await Inventory.findAll({
      include: [
        {
          model: Product,
          as: "product",
          where: { userId },
          attributes: ["id", "name", "images"],
        },
      ],
      order: [["quantity", "ASC"]],
    });

    const lowStockItems = inventory.filter((item) => (item as any).isLowStock);
    const outOfStockItems = inventory.filter(
      (item) => (item as any).isOutOfStock
    );

    res.json({
      success: true,
      message: "Inventory report retrieved successfully",
      data: {
        inventory,
        summary: {
          totalItems: inventory.length,
          lowStockItems: lowStockItems.length,
          outOfStockItems: outOfStockItems.length,
        },
        alerts: {
          lowStock: lowStockItems,
          outOfStock: outOfStockItems,
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
