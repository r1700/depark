import { DataTypes, Model } from "sequelize";
import sequelize from "../../config/sequelize";

export class Technician extends Model {
  public id!: number;
  public name!: string;
  public email?: string | null;
  public phone!: string;
}

Technician.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Technician",
    tableName: "technicians",
    timestamps: false,
  }
);
