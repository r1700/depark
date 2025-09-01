import client from '../services/db/connection';
export async function getAllVehicles(filters?: {
search?: string;
is_active?: boolean;
is_currently_parked?: boolean;
created_at?: string;
updated_at?: string;
}) {
try {
let query = 'SELECT * FROM vehicles WHERE 1=1';
const values: any[] = [];
let idx = 1;

if (filters?.search) {
  query += ` AND license_plate ILIKE $${idx}`;
      values.push(`%${filters.search.trim()}%`);
      idx++;
    }

    if (typeof filters?.is_active === 'boolean') {
      query += ` AND is_active = $${idx}`;
  values.push(filters.is_active);
  idx++;
}

if (typeof filters?.is_currently_parked === 'boolean') {
  query += ` AND is_currently_parked = $${idx}`;
      values.push(filters.is_currently_parked);
      idx++;
    }

    if (filters?.created_at) {
      query += ` AND DATE(created_at) = $${idx}`;
  values.push(filters.created_at.trim());
  idx++;
}

if (filters?.updated_at) {
  query += ` AND DATE(updated_at) = $${idx}`;
  values.push(filters.updated_at.trim());
  idx++;
}

const result = await client.query(query, values);
return result.rows;
} catch (error) {
console.error('Error in getAllVehicles:', error);
throw error instanceof Error ? error : new Error('Internal server error');
}
}

