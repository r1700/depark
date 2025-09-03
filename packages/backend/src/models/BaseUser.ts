import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface BaseUserAttributes {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  created_at: Date;
  updated_at: Date;
}

export interface BaseUserCreationAttributes extends Optional<BaseUserAttributes, 'id'> {}

export class BaseUser extends Model<BaseUserAttributes, BaseUserCreationAttributes>
  implements BaseUserAttributes {
  public id!: number;
  public email!: string;
  public first_name!: string;
  public last_name!: string;
  public created_at!: Date;
  public updated_at!: Date;
}

BaseUser.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'baseuser', // שם הטבלה ב-DB
    timestamps: false, 
    underscored: true, 
  }
);

export default BaseUser;
