import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/databes';
import { AdminUser } from './adminUser';
import { UserStatusEnum } from '../types/UserStatusEnum';

// טיפוסים עבור BaseUser
interface BaseUserAttributes {
  id: number;
  idNumber: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
  status :UserStatusEnum;
  approvedAt:Date;
}

interface BaseUserCreationAttributes extends Optional<BaseUserAttributes, 'id'> {}

export class BaseUser extends Model<BaseUserAttributes, BaseUserCreationAttributes>
  implements BaseUserAttributes {
  public id!: number;
  public idNumber!: string;
  public email!: string;
  public firstName!: string;
  public lastName!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
  public status!: UserStatusEnum;
  public approvedAt!: Date;
}

BaseUser.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    idNumber: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    firstName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(UserStatusEnum)),
      allowNull: false,  
  },
    approvedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        }
  },
  {
    sequelize,
    modelName: 'BaseUser',
    tableName: 'BaseUser',
    timestamps: false, // כי יש לך שדות createdAt ו-updatedAt בטבלה
  }
);