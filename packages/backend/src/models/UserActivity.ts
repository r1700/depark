import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/sequelize';

interface UserActivityAttributes {
  id: number;
  baseuser_id: number;
  user_type: number;
  action: string;
  details: object;
  ip_address?: string;
  user_agent?: string;
  timestamp: Date;
}

interface UserActivityCreationAttributes extends Optional<UserActivityAttributes, 'id'> {}

export class UserActivity extends Model<UserActivityAttributes, UserActivityCreationAttributes>
  implements UserActivityAttributes {
  public id!: number;
  public baseuser_id!: number;
  public user_type!: number;
  public action!: string;
  public details!: object;
  public ip_address?: string;
  public user_agent?: string;
  public timestamp!: Date;
}

UserActivity.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    baseuser_id: { type: DataTypes.INTEGER, allowNull: false },
    user_type: { type: DataTypes.INTEGER, allowNull: false },
    action: { type: DataTypes.STRING, allowNull: false },
    details: { type: DataTypes.JSONB, allowNull: false },
    ip_address: { type: DataTypes.STRING, allowNull: true },
    user_agent: { type: DataTypes.STRING, allowNull: true },
    timestamp: { type: DataTypes.DATE, allowNull: false },
  },
  {
    sequelize,
    tableName: 'useractivities',
    timestamps: false,
    underscored: true,
  }
);

export default UserActivity;