import { Router } from 'express';
import sequelize from '../config/sequelize';
import { QueryTypes } from 'sequelize';

const router = Router();

router.get('/stats', async (req, res) => {
  try {
    const query = `
      SELECT
        psp."spotNumber",
        COUNT(CASE WHEN ps."surfaceSpot" = psp."spotNumber" OR ps."undergroundSpot" = psp."spotNumber" THEN 1 END) AS "entries",
        COUNT(CASE WHEN ps."pickupSpot" = psp."spotNumber" THEN 1 END) AS "exits"
      FROM
        "ParkingSpots" psp
      LEFT JOIN
        "ParkingSessions" ps
        ON (ps."surfaceSpot" = psp."spotNumber" OR ps."pickupSpot" = psp."spotNumber")
      WHERE
        psp.type = 'surface'
      GROUP BY
        psp."spotNumber";
    `;

    const results = await sequelize.query(query, {
      type: QueryTypes.SELECT,
    });

    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;