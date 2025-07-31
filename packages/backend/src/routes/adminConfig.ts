import { Router } from 'express';
import client from '../services/db/connection'; 
const router = Router();

router.post('/', async (req, res) => {
  try {
    const { parkingConfig } = req.body;
    if (!parkingConfig || !parkingConfig.lotId) {
      return res.status(400).json({ success: false, error: 'Missing parkingConfig or lotId' });
    }


    const exists = await client.query(
      `SELECT 1 FROM "ParkingConfigurations" WHERE "id" = $1 LIMIT 1`,
      [parkingConfig.lotId]
    );
    if (exists.rowCount && exists.rowCount > 0) {
      // מחזירים שגיאה תקינה, לא קריסה
      return res.status(409).json({ success: false, error: 'Lot ID already exists' });
    }

    await client.query(
      `INSERT INTO "ParkingConfigurations"
        ("id", "facilityName", "totalSurfaceSpots", "surfaceSpotIds", "avgRetrievalTimeMinutes", "maxQueueSize", "operatingHours", "timezone", "updatedAt", "updatedBy")
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      `,
      [
        parkingConfig.lotId, 
        parkingConfig.facilityName,
        parkingConfig.totalSurfaceSpots,
        parkingConfig.surfaceSpotIds,
        parkingConfig.avgRetrievalTimeMinutes,
        parkingConfig.maxQueueSize,
        JSON.stringify(parkingConfig.operatingHours),
        parkingConfig.timezone,
        parkingConfig.updatedAt,
        parkingConfig.updatedBy || 'admin'
      ]
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Error saving parking config:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});


router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { parkingConfig } = req.body;
    if (!parkingConfig) {
      return res.status(400).json({ success: false, error: 'Missing parkingConfig' });
    }

 
    const exists = await client.query(
      `SELECT 1 FROM "ParkingConfigurations" WHERE "id" = $1 LIMIT 1`,
      [id]
    );
    if (!exists.rowCount || exists.rowCount === 0) {
      return res.status(404).json({ success: false, error: 'Lot ID not found' });
    }

    await client.query(
      `UPDATE "ParkingConfigurations" SET
        "facilityName" = $2,
        "totalSurfaceSpots" = $3,
        "surfaceSpotIds" = $4,
        "avgRetrievalTimeMinutes" = $5,
        "maxQueueSize" = $6,
        "operatingHours" = $7,
        "timezone" = $8,
        "updatedAt" = $9,
        "updatedBy" = $10
       WHERE "id" = $1
      `,
      [
        id,
        parkingConfig.facilityName,
        parkingConfig.totalSurfaceSpots,
        parkingConfig.surfaceSpotIds,
        parkingConfig.avgRetrievalTimeMinutes,
        parkingConfig.maxQueueSize,
        JSON.stringify(parkingConfig.operatingHours),
        parkingConfig.timezone,
        parkingConfig.updatedAt,
        parkingConfig.updatedBy || 'admin'
      ]
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Error updating parking config:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});


router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await client.query(
      `SELECT * FROM "ParkingConfigurations" WHERE "id" = $1 LIMIT 1`,
      [id]
    );
    if (!result.rows || result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Lot ID not found' });
    }
    res.json({ success: true, parkingConfig: result.rows[0] });
  } catch (error) {
    console.error('Error fetching parking config:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

router.get('/', async (req, res) => { 
  try {
    const result = await client.query(`SELECT * FROM "ParkingConfigurations"`);
    res.json({ success: true, parkingConfigs: result.rows });
  } catch (error) {
    console.error('Error fetching parking configs:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

export default router;