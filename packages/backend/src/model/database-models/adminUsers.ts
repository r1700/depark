import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import sequelize from '../../config/sequelize';
import { BaseUser } from './baseUser.model';

export class adminUsers extends Model<
  InferAttributes<adminUsers>,
  InferCreationAttributes<adminUsers>
> {
  declare id: CreationOptional<number>;
  declare baseuser_id: number;
  declare password_hash: string;
  declare role: string;
  declare permissions: string;
  declare last_login_at: Date | null;
}

adminUsers.init({
  id: {
  type: DataTypes.INTEGER,
  primaryKey: true,
  autoIncrement: true

},

  baseuser_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  password_hash: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false
  },
  permissions: {
    type: DataTypes.TEXT, 
    allowNull: false
  },
  last_login_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  sequelize,
  tableName: 'adminusers', 
  timestamps: false
});



