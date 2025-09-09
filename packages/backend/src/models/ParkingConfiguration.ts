
import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/sequelize'; // השתמש בחיבור המרכזי

// הגדרת המודל
export interface ParkingConfigurationAttributes {
  id?: number;
  facilityName: string;
  totalSpots: number; // שינוי חזרה ל-totalSpots
  surfaceSpotIds: string[];
  avgRetrievalTimeMinutes: number;
  maxQueueSize: number;
  maxParallelRetrievals?: number;
  operatingHours: object;
  timezone: string;
  maintenanceMode?: boolean;
  showAdminAnalytics?: boolean;
  updatedAt?: Date;
  updatedBy: string;
}

export class ParkingConfiguration extends Model<ParkingConfigurationAttributes> implements ParkingConfigurationAttributes {
  public id!: number;
  public facilityName!: string;
  public totalSpots!: number; // שינוי חזרה ל-totalSpots
  public surfaceSpotIds!: string[];
  public avgRetrievalTimeMinutes!: number;
  public maxQueueSize!: number;
  public maxParallelRetrievals!: number;
  public operatingHours!: object;
  public timezone!: string;
  public maintenanceMode!: boolean;
  public showAdminAnalytics!: boolean;
  public updatedAt!: Date;
  public updatedBy!: string;
}

ParkingConfiguration.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      field: 'id',
      autoIncrement: true
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
    maxParallelRetrievals: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 1,
      field: 'max_parallel_retrievals'
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
    maintenanceMode: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
      field: 'maintenance_mode'
    },
    showAdminAnalytics: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
      field: 'show_admin_analytics'
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
    underscored: false, // כי אנחנו מגדירים field במפורש
  }
);

export default ParkingConfiguration;


