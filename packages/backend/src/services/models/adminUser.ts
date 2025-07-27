import { DataTypes } from 'sequelize';
import sequelize from '../sequelizeInstance';
import { BaseUser, BaseUserAttributes, BaseUserCreationAttributes } from './baseUser';

interface AdminUserExtra {
  passwordHash: string;
  role: 'hr' | 'admin';
  permissions: string[];
  lastLoginAt?: Date;
}

export interface AdminUserAttributes extends BaseUserAttributes, AdminUserExtra {}
export type AdminUserCreationAttributes = BaseUserCreationAttributes & Partial<Pick<AdminUserExtra, 'lastLoginAt'>>;

export class AdminUser extends BaseUser<AdminUserAttributes, AdminUserCreationAttributes> implements AdminUserAttributes {
  public passwordHash!: string;
  public role!: 'hr' | 'admin';
  public permissions!: string[];
  public lastLoginAt?: Date;
}

AdminUser.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  idNumber: DataTypes.STRING,
  email: DataTypes.STRING,
  firstName: DataTypes.STRING,
  lastName: DataTypes.STRING,
  passwordHash: DataTypes.STRING,
  role: DataTypes.STRING,
  permissions: DataTypes.JSON,
  lastLoginAt: DataTypes.DATE,
}, {
  sequelize,
  modelName: 'user',
  tableName: 'adminUsers',
  freezeTableName: true,
  timestamps: false,
});
