
// בס"ד

// import { Vehicle } from '../../model/vehicle/vehicle';
import client from '../db/connection';

interface Vehicle {
  id: number;
  licensePlate: string;
  height: number;
  width: number;
  length: number;
  weight: number;
  userId: string;
  approved: boolean;
}

interface VehicleLookupRequest {
  licensePlate: string;
  timestamp: Date;
  opcRequestId: string;
}

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

// const isLicensePlateExists = async (licencePlate: string): Promise<boolean> => {
//   try {
//     const res = await client.query<Vehicle>(
//       `SELECT * 
//        FROM "public"."Vehicles"
//        WHERE "licensePlate" = $1`,
//       [licencePlate]
//     );

//     console.log('Query executed successfully:', res.rows);

//     // מחזיר true אם נמצאה לפחות רשומה אחת
//     return res.rows.length > 0;

//   } catch (err: unknown) {
//     if (err instanceof Error) {
//       console.error('Error executing query', err.stack);
//     } else {
//       console.error('Unexpected error', err);
//     }
//     throw err;
//   }
// };


const isLicensePlateExists = async (licencePlate: string): Promise<VehicleLookupResponse> => {
  try {
    const res = await client.query<Vehicle>(
      `SELECT * 
       FROM "public"."Vehicles"
       WHERE "licensePlate" = $1`,
      [licencePlate]
    );

    console.log('Query executed successfully:', res.rows);

    if (res.rows.length === 0) {
      return {
        found: false,
        approved: false,
      };
    }

    const vehicle = res.rows[0];

    return {
      found: true,
      approved: false, //after all the checks, this will be set to true if the vehicle is allowed
      vehicleDetails: {
        height: vehicle.height,
        width: vehicle.width,
        length: vehicle.length,
        weight: vehicle.weight,
      },
      userId: vehicle.userId,
    };

  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error('Error executing query', err.stack);
    } else {
      console.error('Unexpected error', err);
    }
    return {
      found: false,
      approved: false,
      error: 'error executing query',
    };
  }
};


const vehicleRequest = '12345678'

isLicensePlateExists(vehicleRequest)
  .then(vehicles => console.log('Vehicles retrieved:', vehicles))
  .catch(err => console.error('Error fetching vehicles:', err));

export default isLicensePlateExists;