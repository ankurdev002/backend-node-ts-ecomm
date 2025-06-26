import Payment from "../models/payment.model";
import Order from "../models/order.model";
import Notification from "../models/notification.model";
import sequelize from "../config/db";

interface CreatePaymentData {
  orderId: number;
  paymentMethod: string;
  paymentGateway?: string;
  amount: number;
  currency?: string;
}

export const createPayment = async (paymentData: CreatePaymentData) => {
  const transaction = await sequelize.transaction();

  try {
    const {
      orderId,
      paymentMethod,
      paymentGateway,
      amount,
      currency = "USD",
    } = paymentData;

    // Verify order exists and is not already paid
    const order = await Order.findByPk(orderId, { transaction });
    if (!order) {
      throw new Error("Order not found");
    }

    if (order.paymentStatus === "completed") {
      throw new Error("Order is already paid");
    }

    // Create payment record
    const payment = await Payment.create(
      {
        orderId,
        paymentMethod,
        paymentGateway,
        amount,
        currency,
        status: "pending",
      },
      { transaction }
    );

    await transaction.commit();
    return payment;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export const processPayment = async (
  paymentId: number,
  gatewayResponse: Record<string, any>
) => {
  const transaction = await sequelize.transaction();

  try {
    const payment = await Payment.findOne({
      where: { id: paymentId },
      include: [{ model: Order, as: "order" }],
      transaction,
    });

    if (!payment) {
      throw new Error("Payment not found");
    }

    // Update payment with gateway response
    payment.gatewayTransactionId = gatewayResponse.transactionId;
    payment.gatewayResponse = gatewayResponse;
    payment.status = gatewayResponse.success ? "completed" : "failed";
    await payment.save({ transaction });

    // Update order payment status
    if (payment.order) {
      payment.order.paymentStatus = payment.status as any;
      if (payment.status === "completed") {
        payment.order.status = "confirmed";
      }
      await payment.order.save({ transaction });

      // Create notification
      await Notification.create(
        {
          userId: payment.order.userId,
          title:
            payment.status === "completed"
              ? "Payment Successful"
              : "Payment Failed",
          message:
            payment.status === "completed"
              ? `Payment for order ${payment.order.orderNumber} was successful.`
              : `Payment for order ${payment.order.orderNumber} failed. Please try again.`,
          type: "payment",
          relatedId: payment.order.id,
          relatedType: "order",
        },
        { transaction }
      );
    }

    await transaction.commit();
    return payment;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export const refundPayment = async (
  paymentId: number,
  refundAmount: number,
  refundReason: string
) => {
  const transaction = await sequelize.transaction();

  try {
    const payment = await Payment.findOne({
      where: { id: paymentId },
      include: [{ model: Order, as: "order" }],
      transaction,
    });

    if (!payment) {
      throw new Error("Payment not found");
    }

    if (!payment.canBeRefunded()) {
      throw new Error("Payment cannot be refunded");
    }

    if (refundAmount > payment.getRemainingRefundAmount()) {
      throw new Error("Refund amount exceeds available amount");
    }

    // Update payment
    payment.refundAmount += refundAmount;
    payment.refundReason = refundReason;
    if (payment.refundAmount >= payment.amount) {
      payment.status = "refunded";
    }
    await payment.save({ transaction });

    // Update order status if fully refunded
    if (payment.order && payment.refundAmount >= payment.amount) {
      payment.order.status = "refunded";
      payment.order.paymentStatus = "refunded";
      await payment.order.save({ transaction });

      // Create notification
      await Notification.create(
        {
          userId: payment.order.userId,
          title: "Refund Processed",
          message: `Refund of $${refundAmount} for order ${payment.order.orderNumber} has been processed.`,
          type: "payment",
          relatedId: payment.order.id,
          relatedType: "order",
        },
        { transaction }
      );
    }

    await transaction.commit();
    return payment;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export const getPaymentsByOrder = async (orderId: number) => {
  const payments = await Payment.findAll({
    where: { orderId },
    order: [["createdAt", "DESC"]],
  });

  return payments;
};

export const getPaymentById = async (paymentId: number) => {
  const payment = await Payment.findOne({
    where: { id: paymentId },
    include: [{ model: Order, as: "order" }],
  });

  if (!payment) {
    throw new Error("Payment not found");
  }

  return payment;
};

// Mock payment gateway integration
export const processStripePayment = async (
  paymentIntentId: string,
  amount: number
) => {
  // This would integrate with actual Stripe API
  // For now, return mock response
  const success = Math.random() > 0.1; // 90% success rate for demo

  return {
    success,
    transactionId: `stripe_${Date.now()}`,
    gatewayTransactionId: paymentIntentId,
    amount,
    currency: "USD",
    status: success ? "completed" : "failed",
    message: success ? "Payment successful" : "Payment failed",
  };
};

export const processPayPalPayment = async (
  paypalOrderId: string,
  amount: number
) => {
  // This would integrate with actual PayPal API
  const success = Math.random() > 0.1; // 90% success rate for demo

  return {
    success,
    transactionId: `paypal_${Date.now()}`,
    gatewayTransactionId: paypalOrderId,
    amount,
    currency: "USD",
    status: success ? "completed" : "failed",
    message: success ? "Payment successful" : "Payment failed",
  };
};
