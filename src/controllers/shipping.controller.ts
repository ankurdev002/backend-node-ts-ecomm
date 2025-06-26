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
      include: [{ model: Order, as: "order" }],
    });

    if (!shipping) {
      return res.status(404).json({
        success: false,
        message: "Shipping record not found",
      });
    }

    // Update shipping details
    if (status) shipping.status = status;
    if (trackingNumber) shipping.trackingNumber = trackingNumber;
    if (actualDelivery) shipping.actualDelivery = new Date(actualDelivery);
    if (deliveryInstructions)
      shipping.deliveryInstructions = deliveryInstructions;

    await shipping.save();

    // Update order status if delivered
    if (status === "delivered" && (shipping as any).order) {
      (shipping as any).order.status = "delivered";
      await (shipping as any).order.save();

      // Create notification
      await Notification.create({
        userId: (shipping as any).order.userId,
        title: "Order Delivered",
        message: `Your order ${
          (shipping as any).order.orderNumber
        } has been delivered successfully.`,
        type: "shipping",
        relatedId: (shipping as any).order.id,
        relatedType: "order",
      });
    }

    res.json({
      success: true,
      message: "Shipping status updated successfully",
      data: shipping,
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

    const shipping = await Shipping.findOne({
      where: { orderId: parseInt(orderId) },
      include: [{ model: Order, as: "order" }],
    });

    if (!shipping) {
      return res.status(404).json({
        success: false,
        message: "Shipping information not found",
      });
    }

    res.json({
      success: true,
      message: "Shipping information retrieved successfully",
      data: shipping,
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

    const shipping = await Shipping.findOne({
      where: { trackingNumber },
      include: [{ model: Order, as: "order" }],
    });

    if (!shipping) {
      return res.status(404).json({
        success: false,
        message: "Tracking number not found",
      });
    }

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
        orderNumber: (shipping as any).order?.orderNumber,
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

    const assignments = await Order.findAll({
      where: { deliveryPersonId: userId },
      include: [
        { model: Shipping, as: "shipping" },
        { model: Address, as: "shippingAddress" },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json({
      success: true,
      message: "Delivery assignments retrieved successfully",
      data: assignments,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
