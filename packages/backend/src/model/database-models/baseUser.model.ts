import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import sequelize from '../../config/sequelize';

export class BaseUser extends Model<
  InferAttributes<BaseUser>,
  InferCreationAttributes<BaseUser>
> {
  declare id: CreationOptional<number>;
  declare email: string;
  declare first_name: string;
  declare last_name: string;
  declare created_at: Date;
  declare updated_at: Date;
}

BaseUser.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  sequelize,
  tableName: 'baseuser',
  timestamps: false
});
