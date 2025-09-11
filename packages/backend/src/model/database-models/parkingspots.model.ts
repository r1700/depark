import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/sequelize';
class parkingspots extends Model {}
parkingspots.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isOccupied: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  }
  // הוסף עוד שדות במידה ויש לך
}, {
  sequelize,
  tableName: 'parkingspots',
  timestamps: false,
});
export default parkingspots;