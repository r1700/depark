
import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/sequelize';
import { BaseUser } from './baseuser';

interface AdminUserAttributes {
  id: number;
  baseuser_id: number;
  password_hash: string;
  role: number;
  permissions: string[];
  last_login_at?: Date | null;
}

interface AdminUserCreationAttributes extends Optional<AdminUserAttributes, 'id' | 'last_login_at'> {}

export class AdminUser extends Model<AdminUserAttributes, AdminUserCreationAttributes>
  implements AdminUserAttributes {
  public id!: number;
  public baseuser_id!: number;
  public password_hash!: string;
  public role!: number;
  public permissions!: string[];
  public last_login_at?: Date | null;

  static associate() {
    AdminUser.belongsTo(BaseUser, {
      foreignKey: 'baseuser_id',
      as: 'baseUser',
    });
  }
}

AdminUser.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    baseuser_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'baseuser', key: 'id' } },
    password_hash: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.INTEGER, allowNull: false, comment: '1=hr, 2=admin' },
    permissions: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: false },
    last_login_at: { type: DataTypes.DATE, allowNull: true },
  },
  {
    sequelize,
    tableName: 'adminusers',
    modelName: 'adminusers',
    timestamps: false,
  }
);
