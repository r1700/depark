import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

export class UserSession extends Model {
  public id!: number;
  public userId!: number;
  public userType!: 'admin' | 'user';
  public token!: string;
  public expiresAt!: Date;
  public isActive!: boolean;
  public ipAddress?: string;
  public userAgent?: string;
  public createdAt!: Date;
  public lastActivity!: Date;
  public refreshToken?: string;
}

UserSession.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  userType: {
    type: DataTypes.ENUM('admin', 'user'),
    allowNull: false,
  },
  token: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  ipAddress: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  userAgent: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  lastActivity: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  refreshToken: {
    type: DataTypes.STRING,
    allowNull: true,
  }
}, {
  sequelize,
  modelName: 'UserSession',
  tableName: 'UserSessions',
  timestamps: false,
});