
import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/sequelize';
import { BaseUser } from './baseuser';

interface UserAttributes {
  id: number;
  baseuser_id: number;
  department?: string | null;
  employee_id?: string | null;
  google_id?: string | null;
  max_cars_allowed_parking?: number | null;
  created_by: string;
  approved_by?: string | null;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'department' | 'employee_id' | 'google_id' | 'max_cars_allowed_parking' | 'approved_by'> {}

export class User extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes {
  public id!: number;
  public baseuser_id!: number;
  public department?: string | null;
  public employee_id?: string | null;
  public google_id?: string | null;
  public max_cars_allowed_parking?: number | null;
  public created_by!: string;
  public approved_by?: string | null;

  static associate() {
    User.belongsTo(BaseUser, {
      foreignKey: 'baseuser_id',
      as: 'baseUser',
    });
  }
}

User.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    baseuser_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'baseuser', key: 'id' } },
    department: { type: DataTypes.STRING, allowNull: true },
    employee_id: { type: DataTypes.STRING, allowNull: true },
    google_id: { type: DataTypes.STRING, allowNull: true },
    max_cars_allowed_parking: { type: DataTypes.INTEGER, allowNull: true },
    created_by: { type: DataTypes.STRING, allowNull: false },
    approved_by: { type: DataTypes.STRING, allowNull: true },
  },
  {
    sequelize,
    tableName: 'users',
    modelName: 'users',
    timestamps: false,
  }
);
