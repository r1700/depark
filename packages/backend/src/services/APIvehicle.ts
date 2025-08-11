import client from '../db/connection';

export async function getAllVehicles() {
  const result = await client.query('SELECT * FROM vehicles');
  return result.rows;
}