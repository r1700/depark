
// בס"ד

import { Model, DataTypes } from "sequelize";
import { sequelize } from '../../config/sequelize.config';

export class ParkingConfigurations extends Model {
  public id!: number;
  public operating_hours!: object;
}

ParkingConfigurations.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  operating_hours: {
    type: DataTypes.JSONB,
    allowNull: false,
  },
}, {
  sequelize,
  tableName: 'parkingconfigurations',
  modelName: 'ParkingConfigurations',
  timestamps: false,
});

const isParkingLotActive = async (timestamp: Date, ): Promise<boolean> => {
  try {
    const config = await ParkingConfigurations.findOne();

    if (!config) {
      console.error('No parking configuration found');
      return false;
    }

    const operatingHours = config.getDataValue('operating_hours') as {
      [day: string]: {
        isActive: boolean;
        openingHour: string; // "07:00"
        closingHour: string; // "19:00"
      };
    };

    const dayName = timestamp.toLocaleDateString('en-US', { weekday: 'long' }); // e.g., "Monday"
    const timeNow = timestamp.toTimeString().slice(0, 5); // "HH:mm"

    const todayConfig = operatingHours[dayName];
    if (!todayConfig || !todayConfig.isActive) {
      return false;
    }

    return timeNow >= todayConfig.openingHour && timeNow <= todayConfig.closingHour;

  } catch (err) {
    console.error('Error checking parking hours', err);
    return false;
  }
};


isParkingLotActive(new Date())
  .then(active =>
    console.log(`Parking lot is currently ${active ? 'active' : 'inactive'}`))
  .catch(err => console.error('Error checking parking lot status:', err));

export default isParkingLotActive;