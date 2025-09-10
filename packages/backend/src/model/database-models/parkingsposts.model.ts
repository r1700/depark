import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../../config/sequelize'; // עדכן לנתיב שלך

interface ParkingSpotAttributes {
  id: number;
  vehicle_id: number;
  type: number;
  spot_number: string;
  is_occupied: boolean;
  current_vehicle_id?: string | null;
  last_updated: Date;
}

interface ParkingSpotCreationAttributes extends Optional<ParkingSpotAttributes, 'id'> {}

 export class ParkingSpot extends Model<ParkingSpotAttributes, ParkingSpotCreationAttributes>
  implements ParkingSpotAttributes {
  public id!: number;
  public vehicle_id!: number;
  public type!: number;
  public spot_number!: string;
  public is_occupied!: boolean;
  public current_vehicle_id!: string | null;
  public last_updated!: Date;
}

ParkingSpot.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    vehicle_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    type: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    spot_number: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    is_occupied: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    current_vehicle_id: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    last_updated: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'parkingspots',
    timestamps: false,
  }
);

sequelize.sync();
