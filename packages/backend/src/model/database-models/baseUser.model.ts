
import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import sequelize from '../../config/sequelize';
import { UserStatusEnum } from '../../enums/baseuser';
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
  declare phone: string | null;
  declare status?: UserStatusEnum | null;
  declare approved_at?: Date | null;
}

BaseUser.init({
id: {
  type: DataTypes.INTEGER,
  primaryKey: true,
  autoIncrement: true,
  allowNull: false,
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
  phone: {
  type: DataTypes.STRING,
  allowNull: true, // או false בהתאם לסכימה
},

  created_at: {
    type: DataTypes.DATE,
    allowNull: false
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false
  },
  status: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: UserStatusEnum.Pending
  },
  approved_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  sequelize,
  tableName: 'baseuser',
  timestamps: false
});
