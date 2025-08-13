
// // בס"ד

import { Model, DataTypes } from 'sequelize';
import  sequelize  from '../../config/sequelize'

export class Vehicle extends Model {
  public id!: number;
  public baseuser_id!: number;
  public license_plate!: string;
  public vehicle_model_id!: number;
}

export class VehicleModels extends Model {
  public id!: number;
  public dimensions!: object;
}

Vehicle.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  license_plate: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  baseuser_id: DataTypes.INTEGER,
  vehicle_model_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  sequelize,
  tableName: 'vehicles',
  modelName: 'Vehicle',
  timestamps: false,
});

VehicleModels.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  dimensions: {
    type: DataTypes.JSONB,
    allowNull: false,
  },
}, {
  sequelize,
  tableName: 'vehiclemodels',
  modelName: 'VehicleModels',
  timestamps: false,
});


interface VehicleLookupResponse {
  found: boolean;
  vehicleDetails?: {
    height: number;
    width: number;
    length: number;
  };
  userId?: number;
  approved: boolean;
  error?: string;
  vehicle_model_id?: number;

}

const isLicensePlateExists = async (license_plate: string): Promise<VehicleLookupResponse> => {
  try {
    const vehicle = await Vehicle.findOne({ where: { license_plate } });

    if (!vehicle) {
      return {
        found: false,
        approved: false,
      };
    }

    return {
      found: true,
      approved: false,
      userId: vehicle.baseuser_id,
      vehicle_model_id: vehicle.vehicle_model_id,
    };

  } catch (err) {
    console.error('Error executing query', err);
    return {
      found: false,
      approved: false,
      error: 'error executing query',
    };
  }
};

const vehicleModel = async (vehicleModelId: number): Promise<VehicleLookupResponse> => {
  try {
    const model = await VehicleModels.findByPk(vehicleModelId, { attributes: ['dimensions'], raw: true });

    if (!model) {
      return {
        found: false,
        approved: false,
        error: 'Vehicle model not found',
      };
    }
    const dimensions = model.dimensions as {
      height: number;
      width: number;
      length: number;
    };
    if (!dimensions) {
      return {
        found: false,
        vehicleDetails: {
          height: 0,
          width: 0,
          length: 0,
        },
        approved: false,
        error: 'Vehicle dimensions not found',
      };
    }

    return {
      found: true,
      vehicleDetails: {
        height: dimensions.height,
        width: dimensions.width,
        length: dimensions.length,
      },
      approved: true
    };

  } catch (err) {
    console.error('Error fetching vehicle model', err);
    return {
      found: false,
      approved: false,
      error: 'error fetching vehicle model',
    };
  }
}

// isLicensePlateExists('ABC123')
//   .then(res => console.log('Result:', res))
//   .catch(err => console.error('Error:', err));

// vehicleModel(1).then(res => console.log('Vehicle Model:', res))
//   .catch(err => console.error('Error fetching vehicle model:', err));

export { isLicensePlateExists, vehicleModel };
