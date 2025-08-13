
// בס"ד

import { Model, DataTypes } from "sequelize";
import  sequelize  from '../../config/sequelize'

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

interface ParkingConfiguration {
  active: boolean;
  message: string;
}

const isParkingLotActive = async (timestamp: Date, lotid: Number): Promise<ParkingConfiguration> => {
  try {
    const config = await ParkingConfigurations.findOne({ where: { id: lotid } });
    // console.log('config', config);

    if (!config) {
      console.error('No parking configuration found for the given lot ID');
      return {active: false, message: 'Parking lot configuration not found'};
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
    if (!todayConfig ) {
      return {active: false, message:`No configuration for ${dayName}`};
    }

     if (!todayConfig.isActive) {
      return { active: false, message: `Parking lot is closed on ${dayName}` };
    }

     if (timeNow < todayConfig.openingHour || timeNow > todayConfig.closingHour) {
      return { active: false, message: `Parking lot is closed at this hour (${timeNow})` };
    }

    return { active: true, message: 'Parking lot is active' };

  } catch (err) {
    console.error('Error checking parking hours', err);
    return { active: false, message: 'Error checking parking hours' };
  }
};


// isParkingLotActive(new Date(),2)
//   .then(active =>
//     console.log(`Parking lot is currently ${active ? 'active' : 'inactive'}`))
//   .catch(err => console.error('Error checking parking lot status:', err));

export default isParkingLotActive;