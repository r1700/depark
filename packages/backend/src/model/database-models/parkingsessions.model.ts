import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/sequelize';
class parkingsessions extends Model { }
parkingsessions.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  baseuser_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  vehicle_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  parking_spots_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  license_plate: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  surface_spot: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  entry_time: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  exit_time: {
    type: DataTypes.DATE,
    allowNull: true,
  },
 retrieval_request_time: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  actual_retrieval_time: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  pickup_spot: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  requested_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  sequelize,
  tableName: 'parkingsessions',
  timestamps: false,
});
export default parkingsessions;