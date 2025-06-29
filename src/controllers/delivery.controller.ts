import { Request, Response } from "express";
import { AuthenticatedRequest } from "../types/common.type";
import Order from "../models/order.model";
import Shipping from "../models/shipping.model";
import Address from "../models/address.model";
import User from "../models/user.model";
import { USER_ROLES } from "../constants/user_roles";
import { Op } from "sequelize";

export const getDeliveryDashboard = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const userId = req.user?.id;
    const userType = req.user?.userType;

    if (!userId || userType !== USER_ROLES.DELIVERY) {
      return res.status(403).json({
        success: false,
        message: "Access denied: Delivery personnel only",
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [
      totalAssignments,
      todayDeliveries,
      pendingDeliveries,
      completedToday,
      inTransitDeliveries,
    ] = await Promise.all([
      Order.count({ where: { deliveryPersonId: userId } }),
      Order.count({
        where: {
          deliveryPersonId: userId,
          deliveryDate: { [Op.between]: [today, tomorrow] },
        },
      }),
      Order.count({
        where: {
          deliveryPersonId: userId,
          status: { [Op.in]: ["confirmed", "processing", "shipped"] },
        },
      }),
      Shipping.count({
        where: {
          status: "delivered",
          actualDelivery: { [Op.between]: [today, tomorrow] },
        },
        include: [
          {
            model: Order,
            as: "order",
            where: { deliveryPersonId: userId },
            required: true,
          },
        ],
      }),
      Shipping.count({
        where: { status: "in_transit" },
        include: [
          {
            model: Order,
            as: "order",
            where: { deliveryPersonId: userId },
            required: true,
          },
        ],
      }),
    ]);

    res.json({
      success: true,
      message: "Delivery dashboard retrieved successfully",
      data: {
        overview: {
          totalAssignments,
          pendingDeliveries,
          inTransitDeliveries,
        },
        today: {
          scheduledDeliveries: todayDeliveries,
          completedDeliveries: completedToday,
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

export const getAssignedOrders = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const userId = req.user?.id;
    const userType = req.user?.userType;
    const { page = 1, limit = 10, status, date } = req.query;

    if (!userId || userType !== USER_ROLES.DELIVERY) {
      return res.status(403).json({
        success: false,
        message: "Access denied: Delivery personnel only",
      });
    }

    const whereClause: any = { deliveryPersonId: userId };
    if (status) {
      whereClause.status = status;
    }
    if (date) {
      const startDate = new Date(date as string);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);

      whereClause.deliveryDate = { [Op.between]: [startDate, endDate] };
    }

    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

    const { count, rows: orders } = await Order.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit as string),
      offset,
      order: [
        ["deliveryDate", "ASC"],
        ["createdAt", "ASC"],
      ],
    });

    // Fetch related data separately for each order
    const ordersWithDetails = [];
    for (const order of orders) {
      // Get customer info
      const customer = await User.findByPk(order.userId, {
        attributes: ["id", "firstName", "lastName", "email", "phone"],
      });

      // Get shipping address
      const shippingAddress = await Address.findByPk(order.shippingAddressId, {
        attributes: ["street", "city", "state", "zipCode", "phone"],
      });

      // Get shipping info
      const shipping = await Shipping.findOne({
        where: { orderId: order.id },
      });

      // Combine all data
      ordersWithDetails.push({
        ...order.toJSON(),
        customer: customer ? customer.toJSON() : null,
        shippingAddress: shippingAddress ? shippingAddress.toJSON() : null,
        shipping: shipping ? shipping.toJSON() : null,
      });
    }

    res.json({
      success: true,
      message: "Assigned orders retrieved successfully",
      data: {
        orders: ordersWithDetails,
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

export const updateDeliveryStatus = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const userId = req.user?.id;
    const userType = req.user?.userType;
    const { orderId } = req.params;
    const { status, deliveryNote, deliveryProof } = req.body;

    if (!userId || userType !== USER_ROLES.DELIVERY) {
      return res.status(403).json({
        success: false,
        message: "Access denied: Delivery personnel only",
      });
    }

    const order = await Order.findOne({
      where: { id: parseInt(orderId), deliveryPersonId: userId },
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found or not assigned to you",
      });
    }

    // Get shipping separately to avoid association issues
    const shipping = await Shipping.findOne({
      where: { orderId: order.id },
    });

    if (!shipping) {
      return res.status(404).json({
        success: false,
        message: "Shipping record not found",
      });
    }

    // Update shipping status
    if (status) {
      shipping.status = status;
    }
    if (deliveryNote) {
      shipping.deliveryInstructions = deliveryNote;
    }
    if (status === "delivered") {
      shipping.actualDelivery = new Date();
      order.status = "delivered";
    }

    await Promise.all([shipping.save(), order.save()]);

    // Return order and shipping data manually combined
    const orderWithShipping = {
      ...order.toJSON(),
      shipping: shipping.toJSON(),
    };

    res.json({
      success: true,
      message: "Delivery status updated successfully",
      data: { order: orderWithShipping, shipping: shipping.toJSON() },
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getDeliveryRoute = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const userId = req.user?.id;
    const userType = req.user?.userType;
    const { date } = req.query;

    if (!userId || userType !== USER_ROLES.DELIVERY) {
      return res.status(403).json({
        success: false,
        message: "Access denied: Delivery personnel only",
      });
    }

    let targetDate = new Date();
    if (date) {
      targetDate = new Date(date as string);
    }
    targetDate.setHours(0, 0, 0, 0);

    const nextDay = new Date(targetDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const orders = await Order.findAll({
      where: {
        deliveryPersonId: userId,
        deliveryDate: { [Op.between]: [targetDate, nextDay] },
        status: {
          [Op.in]: ["confirmed", "processing", "shipped", "out_for_delivery"],
        },
      },
      order: [["deliveryDate", "ASC"]],
    });

    // Fetch related data separately for each order
    const ordersWithDetails = [];
    for (const order of orders) {
      // Get customer info
      const customer = await User.findByPk(order.userId, {
        attributes: ["firstName", "lastName", "phone"],
      });

      // Get shipping address
      const shippingAddress = await Address.findByPk(order.shippingAddressId);

      // Get shipping info
      const shipping = await Shipping.findOne({
        where: { orderId: order.id },
      });

      // Combine all data
      const orderWithDetails = {
        ...order.toJSON(),
        customer: customer ? customer.toJSON() : null,
        shippingAddress: shippingAddress ? shippingAddress.toJSON() : null,
        shipping: shipping ? shipping.toJSON() : null,
      };

      ordersWithDetails.push(orderWithDetails);
    }

    // Group orders by area/zipcode for optimal routing
    const routeOptimized = ordersWithDetails.reduce((acc: any, order: any) => {
      const zipCode = order.shippingAddress?.zipCode || "unknown";
      if (!acc[zipCode]) {
        acc[zipCode] = [];
      }
      acc[zipCode].push(order);
      return acc;
    }, {});

    res.json({
      success: true,
      message: "Delivery route retrieved successfully",
      data: {
        date: targetDate.toISOString().split("T")[0],
        totalDeliveries: ordersWithDetails.length,
        route: routeOptimized,
        orders: ordersWithDetails,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
