import { Router } from 'express';
import client from '../services/db/connection'; 
const router = Router();

// PUT /api/admin/config
router.put('/config', async (req, res) => {
  try {
    const { parkingConfig } = req.body;

    // ולידציה בסיסית
    if (!parkingConfig || !parkingConfig.lotId) {
      return res.status(400).json({ success: false, error: 'Missing parkingConfig or lotId' });
    }

    await client.query(
      `INSERT INTO "ParkingConfigurations"
        ("id", "facilityName", "totalSurfaceSpots", "surfaceSpotIds", "avgRetrievalTimeMinutes", "maxQueueSize", "operatingHours", "timezone", "updatedAt", "updatedBy")
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       ON CONFLICT ("id") DO UPDATE SET
        "facilityName" = EXCLUDED."facilityName",
        "totalSurfaceSpots" = EXCLUDED."totalSurfaceSpots",
        "surfaceSpotIds" = EXCLUDED."surfaceSpotIds",
        "avgRetrievalTimeMinutes" = EXCLUDED."avgRetrievalTimeMinutes",
        "maxQueueSize" = EXCLUDED."maxQueueSize",
        "operatingHours" = EXCLUDED."operatingHours",
        "timezone" = EXCLUDED."timezone",
        "updatedAt" = EXCLUDED."updatedAt",
        "updatedBy" = EXCLUDED."updatedBy"
      `,
      [
        parkingConfig.lotId, 
        parkingConfig.facilityName,
        parkingConfig.totalSurfaceSpots, // ← כאן
        parkingConfig.surfaceSpotIds,
        parkingConfig.avgRetrievalTimeMinutes, // ← כאן
        parkingConfig.maxQueueSize,
        JSON.stringify(parkingConfig.operatingHours), // ← כאן
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

// GET /api/admin/config/lot-exists/:lotId
// router.get('/lot-exists/:lotId', async (req, res) => {
//   const { lotId } = req.params;
//   const result = await client.query(
//     `SELECT 1 FROM "ParkingConfigurations" WHERE "id" = $1 LIMIT 1`,
//     [lotId]
//   );
//   res.json({ exists: (result.rowCount ?? 0) > 0 });
// });

export default router;