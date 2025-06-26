import { DataTypes, Model, Optional, Association } from "sequelize";
import sequelize from "../config/db";

interface CartAttributes {
  id?: number;
  userId: number;
  productId: number;
  quantity: number;
  selectedVariant?: Record<string, any>;
  price: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface CartCreationAttributes extends Optional<CartAttributes, "id"> {}

class Cart
  extends Model<CartAttributes, CartCreationAttributes>
  implements CartAttributes
{
  public id!: number;
  public userId!: number;
  public productId!: number;
  public quantity!: number;
  public selectedVariant?: Record<string, any>;
  public price!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Association getters
  public readonly user?: any;
  public readonly product?: any;

  // Association methods
  public getUser!: () => Promise<any>;
  public getProduct!: () => Promise<any>;

  public static associations: {
    user: Association<Cart, any>;
    product: Association<Cart, any>;
  };
}

Cart.init(
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
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: 1,
      },
    },
    selectedVariant: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Cart",
    tableName: "cart_items",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["userId", "productId", "selectedVariant"],
      },
    ],
  }
);

export default Cart;
