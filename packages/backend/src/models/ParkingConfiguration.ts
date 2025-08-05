import { DataTypes, Model, Sequelize } from 'sequelize';
import sequelizeConfig from '../config/sequelize.config';

// Create Sequelize connection
const sequelize = new Sequelize({
  ...sequelizeConfig.development,
  dialect: 'postgres' as any,
  logging: false // Disable logs
});

// Model definition
export interface ParkingConfigurationAttributes {
  id?: string; // Changed back to string with optional
  facilityName: string;
  totalSpots: number; // Changed back to totalSpots
  surfaceSpotIds: string[];
  avgRetrievalTimeMinutes: number;
  maxQueueSize: number;
  operatingHours: object;
  timezone: string;
  updatedAt?: Date;
  updatedBy: string;
}

export class ParkingConfiguration extends Model<ParkingConfigurationAttributes> implements ParkingConfigurationAttributes {
  public id!: string; // Changed back to string
  public facilityName!: string;
  public totalSpots!: number; // Changed back to totalSpots
  public surfaceSpotIds!: string[];
  public avgRetrievalTimeMinutes!: number;
  public maxQueueSize!: number;
  public operatingHours!: object;
  public timezone!: string;
  public updatedAt!: Date;
  public updatedBy!: string;
}

ParkingConfiguration.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
      field: 'id'
    },
    facilityName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'facility_name'
    },
    totalSpots: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'total_surface_spots'
    },
    surfaceSpotIds: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      field: 'surface_spot_ids'
    },
    avgRetrievalTimeMinutes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'avg_retrieval_time_minutes'
    },
    maxQueueSize: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'max_queue_size'
    },
    operatingHours: {
      type: DataTypes.JSONB,
      allowNull: false,
      field: 'operating_hours'
    },
    timezone: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'timezone'
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'updated_at'
    },
    updatedBy: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'updated_by'
    },
  },
  {
    sequelize,
    tableName: 'parkingconfigurations',
    timestamps: false,
    underscored: false, // Because we define field explicitly
  }
);

export { sequelize };
export default ParkingConfiguration;
