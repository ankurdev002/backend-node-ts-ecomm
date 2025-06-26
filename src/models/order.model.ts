import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/db";

// Order Status Types
export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export type PaymentStatus = "pending" | "completed" | "failed" | "refunded";

interface OrderAttributes {
  id?: number;
  orderNumber: string;
  userId: number;
  status: OrderStatus;
  totalAmount: number;
  discountAmount: number;
  shippingAmount: number;
  taxAmount: number;
  finalAmount: number;
  shippingAddressId: number;
  billingAddressId?: number;
  paymentMethod?: string;
  paymentStatus: PaymentStatus;
  deliveryDate?: Date;
  vendorId?: number;
  deliveryPersonId?: number;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface OrderCreationAttributes
  extends Optional<
    OrderAttributes,
    "id" | "orderNumber" | "status" | "paymentStatus"
  > {}

class Order
  extends Model<OrderAttributes, OrderCreationAttributes>
  implements OrderAttributes
{
  public id!: number;
  public orderNumber!: string;
  public userId!: number;
  public status!: OrderStatus;
  public totalAmount!: number;
  public discountAmount!: number;
  public shippingAmount!: number;
  public taxAmount!: number;
  public finalAmount!: number;
  public shippingAddressId!: number;
  public billingAddressId?: number;
  public paymentMethod?: string;
  public paymentStatus!: PaymentStatus;
  public deliveryDate?: Date;
  public vendorId?: number;
  public deliveryPersonId?: number;
  public notes?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Association getters
  public readonly items?: any[];
  public readonly customer?: any;
  public readonly vendor?: any;
  public readonly deliveryPerson?: any;
  public readonly shippingAddress?: any;
  public readonly billingAddress?: any;
  public readonly payments?: any[];
  public readonly shipping?: any;

  // Instance methods
  public canBeCancelled(): boolean {
    return ["pending", "confirmed"].includes(this.status);
  }

  public canBeRefunded(): boolean {
    return (
      ["delivered"].includes(this.status) && this.paymentStatus === "completed"
    );
  }

  public isDelivered(): boolean {
    return this.status === "delivered";
  }

  public isPaid(): boolean {
    return this.paymentStatus === "completed";
  }
}

Order.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    orderNumber: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
        "refunded"
      ),
      allowNull: false,
      defaultValue: "pending",
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    discountAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    shippingAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    taxAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    finalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    shippingAddressId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    billingAddressId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    paymentMethod: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    paymentStatus: {
      type: DataTypes.ENUM("pending", "completed", "failed", "refunded"),
      allowNull: false,
      defaultValue: "pending",
    },
    deliveryDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    vendorId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    deliveryPersonId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Order",
    tableName: "orders",
    timestamps: true,
    hooks: {
      beforeCreate: async (order: Order) => {
        if (!order.orderNumber) {
          // Generate unique order number
          const timestamp = Date.now();
          const random = Math.floor(Math.random() * 1000);
          order.orderNumber = `ORD-${timestamp}-${random}`;
        }
      },
    },
  }
);

export default Order;
