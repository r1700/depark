import { Sequelize, DataTypes, Model } from "sequelize";
import sequelize from "../../config/sequelize";

export class Notification extends Model {
  public id!: number;
  public baseuser_id!: number;
  public type!: string;
  public message!: string;
  public read!: boolean;
  public timestamp!: Date;
}

Notification.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    baseuser_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "baseuser_id",
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "type",
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "message",
    },
    read: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "read",
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "timestamp",
    },
  },
  {
    sequelize,
    tableName: "notifications",
    timestamps: false,
  }
);
