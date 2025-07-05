import { Request, Response } from "express";
import { AuthenticatedRequest } from "../types/common.type";
import Payment from "../models/payment.model";
import Order from "../models/order.model";
import {
  createPayment,
  processPayment,
  refundPayment,
  getPaymentsByOrder,
  getPaymentById,
  processStripePayment,
  processPayPalPayment,
} from "../services/payment.service";
import PaymentService from "../services/payment.service";

export const initiatePayment = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const { orderId, paymentMethod, paymentGateway, amount, currency } =
      req.body;
    const userId = req.user?.id;

    if (!orderId || !paymentMethod || !amount) {
      return res.status(400).json({
        success: false,
        message: "Order ID, payment method, and amount are required",
      });
    }

    // Verify the order belongs to the user
    const order = await Order.findOne({
      where: { id: orderId, userId },
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found or access denied",
      });
    }

    const payment = await createPayment({
      orderId,
      paymentMethod,
      paymentGateway,
      amount,
      currency,
    });

    res.status(201).json({
      success: true,
      message: "Payment initiated successfully",
      data: payment,
    });
  } catch (error: any) {
    console.error("initiatePayment error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const handlePaymentCallback = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { paymentId } = req.params;
    const gatewayResponse = req.body;

    if (!paymentId) {
      return res.status(400).json({
        success: false,
        message: "Payment ID is required",
      });
    }

    const payment = await processPayment(parseInt(paymentId), gatewayResponse);

    res.json({
      success: true,
      message: "Payment callback handled successfully",
      data: payment,
    });
  } catch (error: any) {
    console.error("handlePaymentCallback error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const processStripeCallback = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { paymentId } = req.params;
    const { paymentIntentId, amount } = req.body;

    if (!paymentId || !paymentIntentId || !amount) {
      return res.status(400).json({
        success: false,
        message: "Payment ID, payment intent ID, and amount are required",
      });
    }

    // Process with Stripe
    const stripeResponse = await processStripePayment(paymentIntentId, amount);

    // Update payment with gateway response
    const payment = await processPayment(parseInt(paymentId), stripeResponse);

    res.json({
      success: true,
      message: "Stripe callback processed successfully",
      data: payment,
    });
  } catch (error: any) {
    console.error("processStripeCallback error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const processPayPalCallback = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { paymentId } = req.params;
    const { paypalOrderId, amount } = req.body;

    if (!paymentId || !paypalOrderId || !amount) {
      return res.status(400).json({
        success: false,
        message: "Payment ID, PayPal order ID, and amount are required",
      });
    }

    // Process with PayPal
    const paypalResponse = await processPayPalPayment(paypalOrderId, amount);

    // Update payment with gateway response
    const payment = await processPayment(parseInt(paymentId), paypalResponse);

    res.json({
      success: true,
      message: "PayPal callback processed successfully",
      data: payment,
    });
  } catch (error: any) {
    console.error("processPayPalCallback error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const refundOrderPayment = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const { paymentId } = req.params;
    const { refundAmount, refundReason } = req.body;

    if (!paymentId || !refundAmount || !refundReason) {
      return res.status(400).json({
        success: false,
        message: "Payment ID, refund amount, and refund reason are required",
      });
    }

    const payment = await refundPayment(
      parseInt(paymentId),
      parseFloat(refundAmount),
      refundReason
    );

    res.json({
      success: true,
      message: "Payment refunded successfully",
      data: payment,
    });
  } catch (error: any) {
    console.error("refundOrderPayment error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getOrderPayments = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const { orderId } = req.params;
    const userId = req.user?.id;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }

    // Verify the order belongs to the user (unless admin)
    const order = await Order.findOne({
      where: { id: parseInt(orderId), userId },
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found or access denied",
      });
    }

    const payments = await getPaymentsByOrder(parseInt(orderId));

    res.json({
      success: true,
      message: "Order payments retrieved successfully",
      data: payments,
    });
  } catch (error: any) {
    console.error("getOrderPayments error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getPayment = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const { paymentId } = req.params;
    const userId = req.user?.id;

    if (!paymentId) {
      return res.status(400).json({
        success: false,
        message: "Payment ID is required",
      });
    }

    const payment = await getPaymentById(parseInt(paymentId));

    // Verify the payment belongs to the user (check through order)
    if (payment.order && payment.order.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: "Access denied: Payment does not belong to user",
      });
    }

    res.json({
      success: true,
      message: "Payment retrieved successfully",
      data: payment,
    });
  } catch (error: any) {
    console.error("getPayment error:", error);
    if (error.message === "Payment not found") {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

class PaymentController {
  // Create a new payment order
  async createOrder(req: Request, res: Response): Promise<void> {
    try {
      const { amount, currency = "INR" } = req.body;

      if (!amount || amount <= 0) {
        res.status(400).json({
          success: false,
          message: "Invalid amount",
        });
        return;
      }

      const receipt = `order_${Date.now()}`;
      const order = await PaymentService.createOrder(amount, currency, receipt);

      res.status(200).json({
        success: true,
        data: order,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  // Verify payment after completion
  async verifyPayment(req: Request, res: Response): Promise<void> {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
        req.body;

      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        res.status(400).json({
          success: false,
          message: "Missing required payment verification parameters",
        });
        return;
      }

      const isValid = PaymentService.verifyPaymentSignature(
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
      );

      if (!isValid) {
        res.status(400).json({
          success: false,
          message: "Invalid payment signature",
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Payment verified successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  // Get payment details
  async getPaymentDetails(req: Request, res: Response): Promise<void> {
    try {
      const { paymentId } = req.params;
      const payment = await PaymentService.fetchPaymentDetails(paymentId);

      res.status(200).json({
        success: true,
        data: payment,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  // Refund payment
  async refundPayment(req: Request, res: Response): Promise<void> {
    try {
      const { paymentId } = req.params;
      const { amount } = req.body;
      const refund = await PaymentService.refundPayment(paymentId, amount);

      res.status(200).json({
        success: true,
        data: refund,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  // Get all payments
  async getAllPayments(req: Request, res: Response): Promise<void> {
    try {
      const { from, to, skip, count } = req.query;

      const options = {
        from: from ? new Date(from as string) : undefined,
        to: to ? new Date(to as string) : undefined,
        skip: skip ? parseInt(skip as string) : undefined,
        count: count ? parseInt(count as string) : undefined,
      };

      const payments = await PaymentService.fetchAllPayments(options);

      res.status(200).json({
        success: true,
        data: payments,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }
}

export default new PaymentController();
