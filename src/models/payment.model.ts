import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/db";

export type PaymentStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | "cancelled"
  | "refunded";

interface PaymentAttributes {
  id?: number;
  orderId: number;
  paymentMethod: string;
  paymentGateway?: string;
  transactionId?: string;
  gatewayTransactionId?: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  gatewayResponse?: Record<string, any>;
  refundAmount: number;
  refundReason?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface PaymentCreationAttributes
  extends Optional<PaymentAttributes, "id" | "refundAmount"> {}

class Payment
  extends Model<PaymentAttributes, PaymentCreationAttributes>
  implements PaymentAttributes
{
  public id!: number;
  public orderId!: number;
  public paymentMethod!: string;
  public paymentGateway?: string;
  public transactionId?: string;
  public gatewayTransactionId?: string;
  public amount!: number;
  public currency!: string;
  public status!: PaymentStatus;
  public gatewayResponse?: Record<string, any>;
  public refundAmount!: number;
  public refundReason?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Association getters
  public readonly order?: any;

  // Instance methods
  public isSuccessful(): boolean {
    return this.status === "completed";
  }

  public canBeRefunded(): boolean {
    return this.status === "completed" && this.refundAmount < this.amount;
  }

  public getRemainingRefundAmount(): number {
    return this.amount - this.refundAmount;
  }
}

Payment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    paymentMethod: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    paymentGateway: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    transactionId: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    gatewayTransactionId: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: "USD",
    },
    status: {
      type: DataTypes.ENUM(
        "pending",
        "processing",
        "completed",
        "failed",
        "cancelled",
        "refunded"
      ),
      allowNull: false,
      defaultValue: "pending",
    },
    gatewayResponse: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    refundAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    refundReason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Payment",
    tableName: "payments",
    timestamps: true,
    hooks: {
      beforeCreate: async (payment: Payment) => {
        if (!payment.transactionId) {
          // Generate unique transaction ID
          const timestamp = Date.now();
          const random = Math.floor(Math.random() * 10000);
          payment.transactionId = `TXN-${timestamp}-${random}`;
        }
      },
    },
  }
);

export default Payment;
