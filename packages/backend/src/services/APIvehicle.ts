import { Console } from 'node:console';
import { db } from './db/operation'; 
export async function getAllVehicles() {
  const result = await db.query('SELECT * FROM vehicles');
  return result.rows; // Return an empty array if no vehicles found
}
export async function getVehiclesByUserId(baseuserId: string) {
  const result = await db.query('SELECT * FROM vehicles WHERE baseuser_Id = $1', [baseuserId]);
  return result.rows;
}