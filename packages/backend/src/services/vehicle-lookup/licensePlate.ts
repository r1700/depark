
// // בס"ד

// // import { Vehicle } from '../../model/vehicle/vehicle';
// import client from '../db/connection';

// interface Vehicle {
//   id: number;
//   licensePlate: string;
//   height: number;
//   width: number;
//   length: number;
//   weight: number;
//   userId: string;
//   approved: boolean;
// }

// interface VehicleLookupRequest {
//   licensePlate: string;
//   timestamp: Date;
//   opcRequestId: string;
// }

// interface VehicleLookupResponse {
//   found: boolean;
//   vehicleDetails?: {
//     height: number;
//     width: number;
//     length: number;
//     weight: number;
//   };
//   userId?: string;
//   approved: boolean;
//   error?: string;
// }

// // const isLicensePlateExists = async (licencePlate: string): Promise<boolean> => {
// //   try {
// //     const res = await client.query<Vehicle>(
// //       `SELECT * 
// //        FROM "public"."Vehicles"
// //        WHERE "licensePlate" = $1`,
// //       [licencePlate]
// //     );

// //     console.log('Query executed successfully:', res.rows);

// //     // מחזיר true אם נמצאה לפחות רשומה אחת
// //     return res.rows.length > 0;

// //   } catch (err: unknown) {
// //     if (err instanceof Error) {
// //       console.error('Error executing query', err.stack);
// //     } else {
// //       console.error('Unexpected error', err);
// //     }
// //     throw err;
// //   }
// // };


// const isLicensePlateExists = async (licencePlate: string): Promise<VehicleLookupResponse> => {
//   try {
//     const res = await client.query<Vehicle>(
//       `SELECT * 
//        FROM "public"."Vehicles"
//        WHERE "licensePlate" = $1`,
//       [licencePlate]
//     );

//     console.log('Query executed successfully:', res.rows);

//     if (res.rows.length === 0) {
//       return {
//         found: false,
//         approved: false,
//       };
//     }

//     const vehicle = res.rows[0];

//     return {
//       found: true,
//       approved: false, //after all the checks, this will be set to true if the vehicle is allowed
//       vehicleDetails: {
//         height: vehicle.height,
//         width: vehicle.width,
//         length: vehicle.length,
//         weight: vehicle.weight,
//       },
//       userId: vehicle.userId,
//     };

//   } catch (err: unknown) {
//     if (err instanceof Error) {
//       console.error('Error executing query', err.stack);
//     } else {
//       console.error('Unexpected error', err);
//     }
//     return {
//       found: false,
//       approved: false,
//       error: 'error executing query',
//     };
//   }
// };


// const vehicleRequest = '12345678'

// isLicensePlateExists(vehicleRequest)
//   .then(vehicles => console.log('Vehicles retrieved:', vehicles))
//   .catch(err => console.error('Error fetching vehicles:', err));

// export default isLicensePlateExists;



import { Model, DataTypes } from 'sequelize';
import {sequelize} from '../../config/sequelize.config'

export class Vehicle extends Model {
  public id!: number;
  public baseuser_id!: string;
  public license_plate!: string;
  public vehicle_model_id!: number;
  // public width!: number;
  // public length!: number;
  // public weight!: number;
  // public userId!: string;
  // public approved!: boolean;
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
  // height: DataTypes.FLOAT,
  // width: DataTypes.FLOAT,
  // length: DataTypes.FLOAT,
  // weight: DataTypes.FLOAT,
  baseuser_id: DataTypes.STRING,
  // approved: DataTypes.BOOLEAN,
}, {
  sequelize,
  tableName: 'vehicles',
  modelName: 'Vehicle',
  timestamps: false,
});

// import { Vehicle } from '../models/Vehicle';

interface VehicleLookupResponse {
  found: boolean;
  vehicleDetails?: {
    height: number;
    width: number;
    length: number;
    weight: number;
  };
  userId?: string;
  approved: boolean;
  error?: string;
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
      // vehicleDetails: {
        // height: vehicle.height,
        // width: vehicle.width,
        // length: vehicle.length,
        // weight: vehicle.weight,
      // },
      // userId: vehicle.userId,
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

isLicensePlateExists('ABC123')
  .then(res => console.log('Result:', res))
  .catch(err => console.error('Error:', err));

export default isLicensePlateExists;
