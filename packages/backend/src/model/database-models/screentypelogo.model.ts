
import { DataTypes, Model } from "sequelize";
import sequelize from "../../config/sequelize";
import ScreenType from './screentype.model';
import Logo from "./logo.model";

export class ScreenTypeLogo extends Model {
  public id!: number;
  public screenTypeId!: number;
  public logoId!: number;
}


ScreenTypeLogo.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    screenTypeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'ScreenTypes',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    logoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Logos',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  },
  {
    sequelize,
    modelName: "ScreenTypeLogo",
    tableName: "ScreenTypeLogos",
    timestamps: false
  }
);


// קשרים
ScreenTypeLogo.belongsTo(ScreenType, { foreignKey: "screenTypeId", as: "screenType" });
ScreenTypeLogo.belongsTo(Logo, { foreignKey: "logoId", as: "logo" });

export default ScreenTypeLogo;
