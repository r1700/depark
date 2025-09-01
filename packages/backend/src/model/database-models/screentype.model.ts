import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../../config/sequelize';
import Logo from './logo.model';

export interface ScreenTypeAttributes {
  id?: number;
  name: 'CRM' | 'mobile' | 'tablet';
  logoIds?: number[] | null;
}

export interface ScreenTypeCreationAttributes extends Optional<ScreenTypeAttributes, 'id' | 'logoIds'> {}
// אין צורך לשנות כאן, כי LogoCreationAttributes כבר יורש את כל השדות

export class ScreenType extends Model<ScreenTypeAttributes, ScreenTypeCreationAttributes> implements ScreenTypeAttributes {
  public id!: number;
  public name!: 'CRM' | 'mobile' | 'tablet';
  public logoIds!: number[] | null;
}

ScreenType.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.ENUM('CRM', 'mobile', 'tablet'),
      allowNull: false,
      unique: true,
    },
    logoIds: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: true,
      defaultValue: [],
    },
  },
  {
    sequelize,
    tableName: 'ScreenTypes',
    timestamps: false,
  }
);


export default ScreenType;
