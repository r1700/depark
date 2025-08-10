import client from '../db/connection';

export async function getAllVehicles() {
  const result = await client.query('SELECT * FROM vehicles');
  return result.rows;
}

export async function getVehiclesByUserId(baseuserId: string) {
  const result = await client.query('SELECT * FROM vehicles WHERE baseuser_Id = $1', [baseuserId]);
  return result.rows;
}

export async function getVehicleByLicensePlate(licensePlate: string) {
  const result = await client.query('SELECT * FROM vehicles WHERE license_plate = $1', [licensePlate]);
  return result.rows[0];
}

export async function getVehicleByIsActive(isActive: boolean) {
  const result = await client.query('SELECT * FROM vehicles WHERE is_active = $1', [isActive]);
  return result.rows;
}

export async function getVehicleByIsCurrentlyParked(is_currently_parked: boolean) {
  const result = await client.query('SELECT * FROM vehicles WHERE is_currently_parked = $1', [is_currently_parked]);
  return result.rows;
}

export async function getVehicleByCreatedAt(createdAt: string) {
  const result = await client.query('SELECT * FROM vehicles WHERE created_at = $1', [createdAt]);
  return result.rows;
}

export async function getVehiclesByUpdatedAt(updatedAt: string) {
  const result = await client.query(
    'SELECT * FROM vehicles WHERE updated_at = $1',
    [updatedAt]
  );
  return result.rows; 
}