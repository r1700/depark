// services/databaseService.ts
import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: Number(process.env.PG_PORT || 5432), // Default port for PostgreSQL
});

export async function getParkingSpotCounts() {
  const client = await pool.connect();
  
  try {
    const query = `
      SELECT 
        ps.spotNumber,
        COUNT(CASE WHEN ps.surfaceSpot = true THEN 1 END) AS surfaceSpotCount,
        COUNT(CASE WHEN ps.pickupSpot = true THEN 1 END) AS pickupSpotCount
      FROM 
        "ParkingSpot" p
      JOIN 
        "ParkingSession" ps ON ps.parkingSpotId = p.id
      WHERE 
        p.spotNumber IS NOT NULL
      GROUP BY 
        p.spotNumber;
    `;
    
    const result = await client.query(query);
    return result.rows;
  } catch (err) {
    console.error('Error executing query:', err);
    throw new Error('Error fetching parking spot counts');
  } finally {
    client.release(); // Always release the client after use
  }
}
