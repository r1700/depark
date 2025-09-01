import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/sequelize';

class RetrievalQueue extends Model {
  public id!: number;
  public parking_session_id!: number;
  public baseuser_id?: number;
  public license_plate!: string;
  public underground_spot!: string;
  public requested_at!: Date;
  public estimated_time!: Date;
  public position!: number;
  public status!: number; // Define status as a number
  public assigned_pickup_spot?: string;
  public request_source!: number;
}

RetrievalQueue.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    parking_session_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    baseuser_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    license_plate: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    underground_spot: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    requested_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    estimated_time: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    position: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0, // 0: queued, 1: processing, 2: ready, 3: completed
      validate: {
        isIn: [[1, 2, 3, 4]], // Ensure status is one of the defined values
      },
    },
    assigned_pickup_spot: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    request_source: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        isIn: [[1, 2]], // 1: app, 2: kiosk
      },
    },
  },
  {
    sequelize, // Database connection
    modelName: 'RetrievalQueue',
    tableName: 'retrievalqueues',
    timestamps: false, // If there are no createdAt and updatedAt columns
  }
);

export default RetrievalQueue;