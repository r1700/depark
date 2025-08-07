// models/adminusers.ts
import { Model, DataTypes } from 'sequelize';
import sequelize from '../../config/sequelize.config';

class adminusers extends Model {
  public id!: number;
  public password_hash!: string;
}

adminusers.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'adminusers',
    timestamps: false,
  }
);

export default adminusers;
