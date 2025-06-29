import { Request, Response } from "express";
import { AuthenticatedRequest } from "../types/common.type";
import Shipping from "../models/shipping.model";
import Order from "../models/order.model";
import Address from "../models/address.model";
import Notification from "../models/notification.model";
import { USER_ROLES } from "../constants/user_roles";

export const updateShippingStatus = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const userId = req.user?.id;
    const userType = req.user?.userType;
    const { shippingId } = req.params;
    const { status, trackingNumber, actualDelivery, deliveryInstructions } =
      req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    // Check authorization
    if (userType !== USER_ROLES.ADMIN && userType !== USER_ROLES.DELIVERY) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to update shipping status",
      });
    }

    const shipping = await Shipping.findOne({
      where: { id: parseInt(shippingId) },
    });

    if (!shipping) {
      return res.status(404).json({
        success: false,
        message: "Shipping record not found",
      });
    }

    // Get order separately to avoid association issues
    const order = await Order.findByPk(shipping.orderId);

    // Update shipping details
    if (status) shipping.status = status;
    if (trackingNumber) shipping.trackingNumber = trackingNumber;
    if (actualDelivery) shipping.actualDelivery = new Date(actualDelivery);
    if (deliveryInstructions)
      shipping.deliveryInstructions = deliveryInstructions;

    await shipping.save();

    // Update order status if delivered
    if (status === "delivered" && order) {
      order.status = "delivered";
      await order.save();

      // Create notification
      await Notification.create({
        userId: order.userId,
        title: "Order Delivered",
        message: `Your order ${order.orderNumber} has been delivered successfully.`,
        type: "shipping",
        relatedId: order.id,
        relatedType: "order",
      });
    }

    // Return shipping with order data manually attached
    const shippingWithOrder = {
      ...shipping.toJSON(),
      order: order ? order.toJSON() : null,
    };

    res.json({
      success: true,
      message: "Shipping status updated successfully",
      data: shippingWithOrder,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getShippingInfo = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const { orderId } = req.params;

    // Get shipping without include to avoid association issues
    const shipping = await Shipping.findOne({
      where: { orderId: parseInt(orderId) },
    });

    if (!shipping) {
      return res.status(404).json({
        success: false,
        message: "Shipping information not found",
      });
    }

    // Get order separately
    const order = await Order.findByPk(shipping.orderId);

    // Return shipping with order data manually attached
    const shippingWithOrder = {
      ...shipping.toJSON(),
      order: order ? order.toJSON() : null,
    };

    res.json({
      success: true,
      message: "Shipping information retrieved successfully",
      data: shippingWithOrder,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const trackShipment = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { trackingNumber } = req.params;

    // Get shipping without include to avoid association issues
    const shipping = await Shipping.findOne({
      where: { trackingNumber },
    });

    if (!shipping) {
      return res.status(404).json({
        success: false,
        message: "Tracking number not found",
      });
    }

    // Get order separately
    const order = await Order.findByPk(shipping.orderId);

    // Calculate delivery progress
    const deliverySteps = [
      { status: "pending", label: "Order Confirmed", completed: true },
      {
        status: "pickup_scheduled",
        label: "Pickup Scheduled",
        completed: shipping.status !== "pending",
      },
      {
        status: "picked_up",
        label: "Picked Up",
        completed: [
          "picked_up",
          "in_transit",
          "out_for_delivery",
          "delivered",
        ].includes(shipping.status),
      },
      {
        status: "in_transit",
        label: "In Transit",
        completed: ["in_transit", "out_for_delivery", "delivered"].includes(
          shipping.status
        ),
      },
      {
        status: "out_for_delivery",
        label: "Out for Delivery",
        completed: ["out_for_delivery", "delivered"].includes(shipping.status),
      },
      {
        status: "delivered",
        label: "Delivered",
        completed: shipping.status === "delivered",
      },
    ];

    res.json({
      success: true,
      message: "Shipment tracking information retrieved successfully",
      data: {
        trackingNumber: shipping.trackingNumber,
        status: shipping.status,
        shippingMethod: shipping.shippingMethod,
        shippingProvider: shipping.shippingProvider,
        estimatedDelivery: shipping.estimatedDelivery,
        actualDelivery: shipping.actualDelivery,
        deliveryInstructions: shipping.deliveryInstructions,
        orderNumber: order?.orderNumber,
        progress: deliverySteps,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getDeliveryAssignments = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const userId = req.user?.id;
    const userType = req.user?.userType;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    if (userType !== USER_ROLES.DELIVERY) {
      return res.status(403).json({
        success: false,
        message: "Access denied: Delivery personnel only",
      });
    }

    // Get orders without include to avoid association issues
    const orders = await Order.findAll({
      where: { deliveryPersonId: userId },
      order: [["createdAt", "DESC"]],
    });

    // Fetch related data separately for each order
    const ordersWithDetails = [];
    for (const order of orders) {
      // Get shipping info
      const shipping = await Shipping.findOne({
        where: { orderId: order.id },
      });

      // Get shipping address
      const shippingAddress = await Address.findByPk(order.shippingAddressId);

      // Combine all data
      ordersWithDetails.push({
        ...order.toJSON(),
        shipping: shipping ? shipping.toJSON() : null,
        shippingAddress: shippingAddress ? shippingAddress.toJSON() : null,
      });
    }

    res.json({
      success: true,
      message: "Delivery assignments retrieved successfully",
      data: ordersWithDetails,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
