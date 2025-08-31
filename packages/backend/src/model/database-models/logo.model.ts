import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../../config/sequelize';

export interface LogoAttributes {
  id?: number;
  logoUrl: string;
  updatedAt?: Date;
  updatedBy: string;
  name?: string | null;
  url?: string | null;
}

export interface LogoCreationAttributes extends Optional<LogoAttributes, 'id' | 'updatedAt'> {}
// אין צורך לשנות כאן, כי LogoCreationAttributes כבר יורש את כל השדות

export class Logo extends Model<LogoAttributes, LogoCreationAttributes> implements LogoAttributes {
  public id!: number;
  public logoUrl!: string;
  public updatedAt!: Date;
  public updatedBy!: string;
  public name?: string | null;
  public url?: string | null;
}

Logo.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    logoUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedBy: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'Logos',
    timestamps: false,
  }
);

export default Logo;
