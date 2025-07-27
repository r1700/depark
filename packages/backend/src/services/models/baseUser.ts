import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../sequelizeInstance';

export interface BaseUserAttributes {
  id?: number;
  idNumber: string;
  email: string;
  firstName: string;
  lastName: string;
}

export type BaseUserCreationAttributes = Optional<BaseUserAttributes, 'id'>;

// 👇 הפיכת BaseUser למחלקה גנרית
export class BaseUser<TAttributes extends BaseUserAttributes = BaseUserAttributes, TCreationAttributes extends BaseUserCreationAttributes = BaseUserCreationAttributes>
  extends Model<TAttributes, TCreationAttributes>
  implements BaseUserAttributes {
    public id!: number;
    public idNumber!: string;
    public email!: string;
    public firstName!: string;
    public lastName!: string;
}
BaseUser.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  idNumber: {
    type: DataTypes.STRING,
     allowNull: true, 
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, 
{
  sequelize, // instance of Sequelize
  modelName: 'baseuser',
  tableName: 'BaseUser',
  freezeTableName: true, // prevents Sequelize from pluralizing the table name
  timestamps: false, // disables createdAt and updatedAt fields
});