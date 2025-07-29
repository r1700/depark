
// בס"ד

import client from "../db/connection";  

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

const isParkingLotActive = async (timestamp: Date): Promise<boolean> => {
  try {
    const res = await client.query<Vehicle>(
      `SELECT * 
       FROM "public."ParkingConfigurations""
       WHERE "licensePlate" = $1`,
      [timestamp]
    );

    if (res.rows.length > 0) {
      return res.rows[0].approved; // Assuming 'approved' indicates if the vehicle is allowed
    }
    return false; // Vehicle not found
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error('Error executing query', err.stack);
    } else {
      console.error('Unexpected error', err);
    }
    throw err;
  }
}

export default isParkingLotActive;