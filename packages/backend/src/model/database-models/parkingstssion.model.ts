import { DataTypes, Model } from "sequelize";

import sequelize from '../../config/sequelize'




export class ParkingSession extends Model {
  public id!: number;
  public userId!: string;
  public vehicleId!: number;
  public licensePlate!: string;
  public surfaceSpot!: boolean;
  public undergroundSpot!: boolean;
  public status!: string;
  public entryTime!: Date;
  public exitTime!: Date | null;
  public retrievalRequestTime!: Date | null;
  public actualRetrievalTime!: Date | null;
  public pickupSpot!: string;
  public requestedBy!: string;
 
}



ParkingSession.init(
  {
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    vehicleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    licensePlate: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    surfaceSpot: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    undergroundSpot: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    entryTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    exitTime: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    retrievalRequestTime: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    actualRetrievalTime: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    pickupSpot: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    requestedBy: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    
  },
  {
    sequelize,
    modelName: "ParkingSession",
    timestamps: false, 
  }
);


sequelize.sync();

