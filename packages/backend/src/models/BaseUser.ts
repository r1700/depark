import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database'; // נתיב למיקום קובץ sequelize שלך

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

BaseUser.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    idNumber: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    firstName: { type: DataTypes.STRING, allowNull: false },
    lastName: { type: DataTypes.STRING, allowNull: false },
    createdAt: { type: DataTypes.DATE, allowNull: false },
    updatedAt: { type: DataTypes.DATE, allowNull: false },
  },
  {
    sequelize,
    tableName: 'BaseUser',
    timestamps: false, // משתמשים בעמודות createdAt, updatedAt שטוחות
  }
);

export default BaseUser;