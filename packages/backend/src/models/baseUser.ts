import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/databes';
import { AdminUser } from './adminUser';
// טיפוסים עבור BaseUser
interface BaseUserAttributes {
  id: number;
  idNumber: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
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
}
BaseUser.hasOne(AdminUser, { foreignKey: 'baseUserId', as: 'adminUser' });

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
  },
  {
    sequelize,
    modelName: 'BaseUser',
    tableName: 'BaseUsers',
    timestamps: false, // כי יש לך שדות createdAt ו-updatedAt בטבלה
  }
);