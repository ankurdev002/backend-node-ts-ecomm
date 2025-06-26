import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/db";

export type CouponType = "percentage" | "fixed";

interface CouponAttributes {
  id?: number;
  code: string;
  name: string;
  description?: string;
  type: CouponType;
  value: number;
  minOrderAmount: number;
  maxDiscountAmount?: number;
  usageLimit: number;
  usedCount: number;
  userLimit: number;
  validFrom: Date;
  validUntil: Date;
  isActive: boolean;
  applicableProducts?: number[];
  applicableCategories?: number[];
  createdAt?: Date;
  updatedAt?: Date;
}

interface CouponCreationAttributes extends Optional<CouponAttributes, "id"> {}

class Coupon
  extends Model<CouponAttributes, CouponCreationAttributes>
  implements CouponAttributes
{
  public id!: number;
  public code!: string;
  public name!: string;
  public description?: string;
  public type!: CouponType;
  public value!: number;
  public minOrderAmount!: number;
  public maxDiscountAmount?: number;
  public usageLimit!: number;
  public usedCount!: number;
  public userLimit!: number;
  public validFrom!: Date;
  public validUntil!: Date;
  public isActive!: boolean;
  public applicableProducts?: number[];
  public applicableCategories?: number[];
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Instance methods
  public isValid(): boolean {
    const now = new Date();
    return (
      this.isActive &&
      this.validFrom <= now &&
      this.validUntil >= now &&
      this.usedCount < this.usageLimit
    );
  }

  public canBeUsed(): boolean {
    return this.isValid() && this.usedCount < this.usageLimit;
  }

  public calculateDiscount(orderAmount: number): number {
    if (!this.isValid() || orderAmount < this.minOrderAmount) {
      return 0;
    }

    let discount = 0;
    if (this.type === "percentage") {
      discount = (orderAmount * this.value) / 100;
    } else {
      discount = this.value;
    }

    // Apply max discount limit if set
    if (this.maxDiscountAmount && discount > this.maxDiscountAmount) {
      discount = this.maxDiscountAmount;
    }

    return Math.round(discount * 100) / 100; // Round to 2 decimal places
  }

  public async incrementUsage(): Promise<void> {
    this.usedCount += 1;
    await this.save();
  }

  public isApplicableToProduct(productId: number): boolean {
    if (!this.applicableProducts || this.applicableProducts.length === 0) {
      return true; // If no specific products, applicable to all
    }
    return this.applicableProducts.includes(productId);
  }

  public isApplicableToCategory(categoryId: number): boolean {
    if (!this.applicableCategories || this.applicableCategories.length === 0) {
      return true; // If no specific categories, applicable to all
    }
    return this.applicableCategories.includes(categoryId);
  }
}

Coupon.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    type: {
      type: DataTypes.ENUM("percentage", "fixed"),
      allowNull: false,
    },
    value: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    minOrderAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    maxDiscountAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    usageLimit: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    usedCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    userLimit: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    validFrom: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    validUntil: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    applicableProducts: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    applicableCategories: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Coupon",
    tableName: "coupons",
    timestamps: true,
  }
);

export default Coupon;
