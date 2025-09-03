import { Router } from 'express';
import sequelize from '../config/sequelize';
import { QueryTypes } from 'sequelize';

const router = Router();

router.get('/stats', async (req, res) => {
  try {
    const query = `
      SELECT
        psp.spot_number,
        COUNT(CASE WHEN ps.surface_spot = psp.spot_number OR ps.underground_spot = psp.spot_number THEN 1 END) AS entries,
        COUNT(CASE WHEN ps.pickup_spot = psp.spot_number THEN 1 END) AS exits
      FROM
        parkingspots psp
      LEFT JOIN
        parkingsessions ps
        ON (ps.surface_spot = psp.spot_number OR ps.pickup_spot = psp.spot_number)
      WHERE
        psp.type = 1
      GROUP BY
        psp.spot_number;
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