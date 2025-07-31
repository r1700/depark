import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/sequelize.config';

// BaseUser Model
export class BaseUser extends Model {
  public id!: number;
  public email!: string;
  public firstName!: string;
  public lastName!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
  public adminData?: AdminUser;
}
BaseUser.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING, allowNull: false },
  firstName: { type: DataTypes.STRING, allowNull: false },
  lastName: { type: DataTypes.STRING, allowNull: false },
  createdAt: { type: DataTypes.DATE, allowNull: false },
  updatedAt: { type: DataTypes.DATE, allowNull: false },
}, {
  sequelize,
  modelName: 'BaseUser',
  tableName: 'BaseUser',
  timestamps: false,
});

// AdminUser Model
export class AdminUser extends Model {
  public id!: number;
  public passwordHash!: string;
  public role!: 'hr' | 'admin';
  public permissions!: string[];
  public lastLoginAt?: Date;
  public createdAt!: Date;
  public updatedAt!: Date;
  public userId!: number;
}
AdminUser.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  passwordHash: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM('hr', 'admin'), allowNull: false },
  permissions: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: false },
  lastLoginAt: { type: DataTypes.DATE, allowNull: true },
  createdAt: { type: DataTypes.DATE, allowNull: false },
  updatedAt: { type: DataTypes.DATE, allowNull: false },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'BaseUser',
      key: 'id'
    }
  }
}, {
  sequelize,
  modelName: 'AdminUser',
  tableName: 'AdminUsers',
  timestamps: false,
});

// UserSession Model
export class UserSession extends Model {
  public id!: number;
  public userId!: number;
  public userType!: 'user' | 'admin';
  public token!: string;
  public refreshToken?: string;
  public expiresAt!: Date;
  public isActive!: boolean;
  public ipAddress!: string;
  public userAgent!: string;
  public createdAt!: Date;
  public lastActivity!: Date;
  public tempToken?: string;
}
UserSession.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER,  allowNull: false },
  userType: { type: DataTypes.ENUM('user', 'admin'), allowNull: false },
  token: { type: DataTypes.STRING, allowNull: false },
  refreshToken: { type: DataTypes.STRING, allowNull: true },
  expiresAt: { type: DataTypes.DATE, allowNull: false },
  isActive: { type: DataTypes.BOOLEAN, allowNull: false },
  ipAddress: { type: DataTypes.STRING, allowNull: false },
  userAgent: { type: DataTypes.STRING, allowNull: false },
  createdAt: { type: DataTypes.DATE, allowNull: false },
  lastActivity: { type: DataTypes.DATE, allowNull: false },
  tempToken: { type: DataTypes.STRING, allowNull: true },
}, {
  sequelize,
  modelName: 'UserSession',
  tableName: 'UserSessions',
  timestamps: false,
});

BaseUser.hasOne(AdminUser, { foreignKey: 'userId', as: 'adminData' });
AdminUser.belongsTo(BaseUser, { foreignKey: 'userId', as: 'baseData' });
BaseUser.hasMany(UserSession, { foreignKey: 'userId', as: 'sessions' });
UserSession.belongsTo(BaseUser, { foreignKey: 'userId', as: 'user' });