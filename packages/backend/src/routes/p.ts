import { Pool } from 'pg'; // נניח שאתה משתמש ב- pg להתחברות לפוסטגרס
import { ParkingSpot } from '../model/park/parkingSpot';

// יצירת חיבור לפוסטגרס
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'depark',
  password: '9181',
  port: 5432,
});

// פונקציה שמבצעת את השאילתא לכל ParkingSpot
async function getParkingSpotCounts(parkingSpots: ParkingSpot[]) {
  const client = await pool.connect();

  try {
    // עבור כל ParkingSpot, מבצע את השאילתא
    for (const spot of parkingSpots) {
      const query = `
        SELECT 
          ps.spotNumber,
          COUNT(CASE WHEN ps.surfaceSpot = $1 THEN 1 END) AS surfaceSpotCount,
          COUNT(CASE WHEN ps.pickupSpot = $1 THEN 1 END) AS pickupSpotCount
        FROM 
          "ParkingSpot" p
        JOIN 
          "ParkingSession" ps ON ps.parkingSpotId = p.id
        WHERE 
          p.spotNumber = $1
        GROUP BY 
          p.spotNumber;
      `;

      // הרצת השאילתא עם spotNumber כפרמטר
      const result = await client.query(query, [spot.spotNumber]);

      // הדפסת התוצאה
      console.log(`Spot Number: ${spot.spotNumber}`, result.rows);
    }
  } catch (err) {
    console.error('שגיאה בהרצת השאילתא', err);
  } finally {
    client.release();
  }
}

// דוגמה לשימוש
const parkingSpots = [
  new ParkingSpot('surface', 'A101', true, undefined, new Date()),
  new ParkingSpot('underground', 'B202', false, undefined, new Date()),
];

getParkingSpotCounts(parkingSpots).then(() => {
  console.log('השאילתא בוצעה עבור כל ה-ParkingSpots');
}).catch(err => {
  console.error('שגיאה בביצוע החישוב', err);
});
