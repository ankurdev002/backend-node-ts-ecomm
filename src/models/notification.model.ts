import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/db";

export type NotificationType =
  | "info"
  | "success"
  | "warning"
  | "error"
  | "order"
  | "payment"
  | "shipping";

interface NotificationAttributes {
  id?: number;
  userId: number;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  relatedId?: number;
  relatedType?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface NotificationCreationAttributes
  extends Optional<NotificationAttributes, "id" | "isRead"> {}

class Notification
  extends Model<NotificationAttributes, NotificationCreationAttributes>
  implements NotificationAttributes
{
  public id!: number;
  public userId!: number;
  public title!: string;
  public message!: string;
  public type!: NotificationType;
  public isRead!: boolean;
  public relatedId?: number;
  public relatedType?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Instance methods
  public async markAsRead(): Promise<void> {
    this.isRead = true;
    await this.save();
  }

  public isOrderRelated(): boolean {
    return this.type === "order" || this.relatedType === "order";
  }

  public isPaymentRelated(): boolean {
    return this.type === "payment" || this.relatedType === "payment";
  }

  public isShippingRelated(): boolean {
    return this.type === "shipping" || this.relatedType === "shipping";
  }
}

Notification.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM(
        "info",
        "success",
        "warning",
        "error",
        "order",
        "payment",
        "shipping"
      ),
      allowNull: false,
      defaultValue: "info",
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    relatedId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    relatedType: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Notification",
    tableName: "notifications",
    timestamps: true,
  }
);

export default Notification;
