import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';

interface UserActivityAttributes {
  id: string;
  userId?: string;
  userType: 'hr' | 'admin' | 'employee' | 'anonymous';
  action: string;
  details: object;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface UserActivityCreationAttributes extends Optional<UserActivityAttributes, 'id'> {}

export class UserActivity extends Model<UserActivityAttributes, UserActivityCreationAttributes>
  implements UserActivityAttributes {
  public id!: string;
  public userId?: string;
  public userType!: 'hr' | 'admin' | 'employee' | 'anonymous';
  public action!: string;
  public details!: object;
  public ipAddress?: string;
  public userAgent?: string;
  public timestamp!: Date;
  public createdAt!: Date;
  public updatedAt!: Date;
}

UserActivity.init(
  {
    id: { type: DataTypes.STRING, primaryKey: true },
    userId: { type: DataTypes.STRING, allowNull: true },
    userType: { type: DataTypes.ENUM('hr', 'admin', 'employee', 'anonymous'), allowNull: false },
    action: { type: DataTypes.STRING, allowNull: false },
    details: { type: DataTypes.JSONB, allowNull: false },
    ipAddress: { type: DataTypes.STRING, allowNull: true },
    userAgent: { type: DataTypes.STRING, allowNull: true },
    timestamp: { type: DataTypes.DATE, allowNull: false },
    createdAt: { type: DataTypes.DATE, allowNull: false },
    updatedAt: { type: DataTypes.DATE, allowNull: false },
  },
  {
    sequelize,
    tableName: 'UserActivities',
    timestamps: false,
  }
);

export default UserActivity;