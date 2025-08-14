import { Sequelize, DataTypes, Model } from "sequelize";
import sequelize from '../../config/sequelize'


export class Vehicle extends Model {
  public id!: number;
  public userId!: string;
  public licensePlate!: string;
  public vehicleModelId?: string;
  public color?: string;
  public isActive!: boolean;
  public isCurrentlyParked!: boolean;
  public createdAt!: Date;
  public updatedAt!: Date;
  public addedBy!: "user" | "hr";
  public ParkingSessionId?: string;
  public dimensionOverrides?: {
    height?: number;
    width?: number;
    length?: number;
    weight?: number;
  };
  public dimensionsSource!: "model_reference" | "manual_override" | "government_db";
}

Vehicle.init(
  {
id: {
  type: DataTypes.INTEGER,
  autoIncrement: true,
  primaryKey: true,
},
    userId: {
      type: DataTypes.STRING,
    },
    licensePlate: {
      type: DataTypes.STRING,
    },
    vehicleModelId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    color: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
    },
    isCurrentlyParked: {
      type: DataTypes.BOOLEAN,
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
    addedBy: {
      type: DataTypes.ENUM("user", "hr"),
    },
    ParkingSessionId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    dimensionOverrides: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    dimensionsSource: {
      type: DataTypes.ENUM("model_reference", "manual_override", "government_db"),
    },
  },
  {
    sequelize,
    modelName: "Vehicle",
    timestamps: true, 
  }
);
sequelize.sync();
