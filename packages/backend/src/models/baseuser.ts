
import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/sequelize';
import { UserStatusEnum } from '../enums/baseuser';

interface BaseUserAttributes {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  status?: UserStatusEnum | null;
  approved_at?: Date | null;
  created_at: Date;
  updated_at: Date;
}

interface BaseUserCreationAttributes extends Optional<BaseUserAttributes, 'id' | 'status' | 'approved_at'> {}

export class BaseUser extends Model<BaseUserAttributes, BaseUserCreationAttributes>
  implements BaseUserAttributes {
  public id!: number;
  public email!: string;
  public first_name!: string;
  public last_name!: string;
  public status?: UserStatusEnum | null;
  public approved_at?: Date | null;
  public created_at!: Date;
  public updated_at!: Date;
}

BaseUser.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    email: { type: DataTypes.STRING, allowNull: false },
    first_name: { type: DataTypes.STRING, allowNull: false },
    last_name: { type: DataTypes.STRING, allowNull: false },
    status: { type: DataTypes.INTEGER, allowNull: true, defaultValue: UserStatusEnum.Pending },
    approved_at: { type: DataTypes.DATE, allowNull: true },
    created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  },
  {
    sequelize,
    tableName: 'baseuser',
    modelName: 'baseuser',
    timestamps: false,
  }
);
