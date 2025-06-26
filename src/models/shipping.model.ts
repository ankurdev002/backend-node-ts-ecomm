import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/db";

export type ShippingStatus =
  | "pending"
  | "pickup_scheduled"
  | "picked_up"
  | "in_transit"
  | "out_for_delivery"
  | "delivered"
  | "returned";

interface ShippingAttributes {
  id?: number;
  orderId: number;
  shippingMethod: string;
  trackingNumber?: string;
  shippingProvider?: string;
  estimatedDelivery?: Date;
  actualDelivery?: Date;
  shippingCost: number;
  status: ShippingStatus;
  deliveryInstructions?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ShippingCreationAttributes
  extends Optional<ShippingAttributes, "id" | "status"> {}

class Shipping
  extends Model<ShippingAttributes, ShippingCreationAttributes>
  implements ShippingAttributes
{
  public id!: number;
  public orderId!: number;
  public shippingMethod!: string;
  public trackingNumber?: string;
  public shippingProvider?: string;
  public estimatedDelivery?: Date;
  public actualDelivery?: Date;
  public shippingCost!: number;
  public status!: ShippingStatus;
  public deliveryInstructions?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Instance methods
  public isDelivered(): boolean {
    return this.status === "delivered";
  }

  public isInTransit(): boolean {
    return ["picked_up", "in_transit", "out_for_delivery"].includes(
      this.status
    );
  }

  public getDeliveryDays(): number | null {
    if (this.actualDelivery && this.createdAt) {
      const timeDiff = this.actualDelivery.getTime() - this.createdAt.getTime();
      return Math.ceil(timeDiff / (1000 * 3600 * 24));
    }
    return null;
  }
}

Shipping.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true, // One shipping record per order
    },
    shippingMethod: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    trackingNumber: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    shippingProvider: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    estimatedDelivery: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    actualDelivery: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    shippingCost: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.ENUM(
        "pending",
        "pickup_scheduled",
        "picked_up",
        "in_transit",
        "out_for_delivery",
        "delivered",
        "returned"
      ),
      allowNull: false,
      defaultValue: "pending",
    },
    deliveryInstructions: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Shipping",
    tableName: "shipping",
    timestamps: true,
    hooks: {
      beforeCreate: async (shipping: Shipping) => {
        if (!shipping.trackingNumber) {
          // Generate tracking number
          const timestamp = Date.now();
          const random = Math.floor(Math.random() * 100000);
          shipping.trackingNumber = `TRK-${timestamp}-${random}`;
        }
      },
    },
  }
);

export default Shipping;
