import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/db";
import { USER_ROLES, UserRole } from "../constants/user_roles";

interface UserAttributes {
  id?: Number;
  name: string;
  email: string;
  password: string;
  userType: UserRole;
  currentOtp?: string | null; // Stores OTP, nullable
  isVerified: boolean; // Checks if user is verified
  isActive: boolean; // Checks if user account is active
  phone?: string; // User phone number
  avatar?: string; // User profile picture URL
  createdAt?: Date;
  updatedAt?: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: Number;
  public name!: string;
  public email!: string;
  public password!: string;
  public userType!: UserRole;
  public currentOtp!: string | null;
  public isVerified!: boolean;
  public isActive!: boolean;
  public phone?: string;
  public avatar?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Association getters
  public readonly addresses?: any[];
  public readonly cartItems?: any[];
  public readonly orders?: any[];
  public readonly vendorOrders?: any[];
  public readonly deliveryOrders?: any[];
  public readonly products?: any[];
  public readonly reviews?: any[];
  public readonly notifications?: any[];
  public readonly wishlistItems?: any[];
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false, // Ensure it's required
    },
    userType: {
      type: DataTypes.ENUM(
        USER_ROLES.ADMIN,
        USER_ROLES.VENDOR,
        USER_ROLES.DELIVERY,
        USER_ROLES.NORMAL
      ),
      allowNull: false,
      defaultValue: USER_ROLES.NORMAL, // Default user type
    },
    currentOtp: {
      type: DataTypes.STRING(6), // 6-digit OTP
      allowNull: true, // Nullable because it will be removed after verification
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false, // Default is false, user needs to verify
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true, // Default is active
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    avatar: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
  }
);

export default User;
