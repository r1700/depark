import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface AdminUserAttributes {
  id: number;
  baseuser_id: number;
  password_hash: string;
  role: number;
  permissions: number;
  last_login_at?: Date | null;
}

export interface AdminUserCreationAttributes extends Optional<AdminUserAttributes, 'id' | 'last_login_at'> {}

export class AdminUser extends Model<AdminUserAttributes, AdminUserCreationAttributes>
  implements AdminUserAttributes {
  public id!: number;
  public baseuser_id!: number;
  public password_hash!: string;
  public role!: number;
  public permissions!: number;
  public last_login_at?: Date | null;
  public created_at!: Date;
  public updated_at!: Date;
}

AdminUser.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    baseuser_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    permissions: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    last_login_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'adminusers', 
    timestamps: false, 
    underscored: true, 
  }
);

export default AdminUser;
