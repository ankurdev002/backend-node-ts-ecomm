import { DataTypes, Model, Optional, Association } from "sequelize";
import sequelize from "../config/db";

interface InventoryAttributes {
  id?: number;
  productId: number;
  sku: string;
  quantity: number;
  reservedQuantity: number;
  reorderLevel: number;
  lastRestocked?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

interface InventoryCreationAttributes
  extends Optional<InventoryAttributes, "id" | "reservedQuantity"> {}

class Inventory
  extends Model<InventoryAttributes, InventoryCreationAttributes>
  implements InventoryAttributes
{
  public id!: number;
  public productId!: number;
  public sku!: string;
  public quantity!: number;
  public reservedQuantity!: number;
  public reorderLevel!: number;
  public lastRestocked?: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Association getters
  public readonly product?: any;

  // Association methods
  public getProduct!: () => Promise<any>;

  public static associations: {
    product: Association<Inventory, any>;
  };

  // Instance methods
  public get availableQuantity(): number {
    return this.quantity - this.reservedQuantity;
  }

  public get isLowStock(): boolean {
    return this.availableQuantity <= this.reorderLevel;
  }

  public get isOutOfStock(): boolean {
    return this.availableQuantity <= 0;
  }

  public async reserveStock(quantity: number): Promise<boolean> {
    if (this.availableQuantity >= quantity) {
      this.reservedQuantity += quantity;
      await this.save();
      return true;
    }
    return false;
  }

  public async releaseStock(quantity: number): Promise<void> {
    this.reservedQuantity = Math.max(0, this.reservedQuantity - quantity);
    await this.save();
  }

  public async fulfillOrder(quantity: number): Promise<boolean> {
    if (this.reservedQuantity >= quantity && this.quantity >= quantity) {
      this.quantity -= quantity;
      this.reservedQuantity -= quantity;
      await this.save();
      return true;
    }
    return false;
  }
}

Inventory.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true, // One inventory record per product
    },
    sku: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    reservedQuantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    reorderLevel: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 10,
      validate: {
        min: 0,
      },
    },
    lastRestocked: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Inventory",
    tableName: "inventory",
    timestamps: true,
  }
);

export default Inventory;
