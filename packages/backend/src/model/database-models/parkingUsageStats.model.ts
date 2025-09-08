import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../../config/sequelize'; // עדכן את הנתיב בהתאם

export interface ParkingUsageStatsAttributes {
  id?: number;
  date: Date;
  hour: number;
  totalParkedCars: number;
  avgRetrievalTime: number;
  maxQueueLength: number;
  peakUsageTime: string;
  utilizationPercentage: number;
  totalEntries: number;
  totalExits: number;
}

export type ParkingUsageStatsCreationAttributes = Optional<ParkingUsageStatsAttributes, 'id'>;

export class ParkingUsageStats
  extends Model<ParkingUsageStatsAttributes, ParkingUsageStatsCreationAttributes>
  implements ParkingUsageStatsAttributes {
  
  public id!: number;
  public date!: Date;
  public hour!: number;
  public totalParkedCars!: number;
  public avgRetrievalTime!: number;
  public maxQueueLength!: number;
  public peakUsageTime!: string;
  public utilizationPercentage!: number;
  public totalEntries!: number;
  public totalExits!: number;
}

ParkingUsageStats.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  hour: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  totalParkedCars: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  avgRetrievalTime: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  maxQueueLength: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  peakUsageTime: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  utilizationPercentage: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  totalEntries: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  totalExits: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
},
{
  sequelize,
  modelName: 'parkingusagestats',
  tableName: 'parkingusagestats',
  freezeTableName: true,
  timestamps: false,
});
