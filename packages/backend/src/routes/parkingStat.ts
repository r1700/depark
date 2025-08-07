import { Router } from 'express';
import sequelize from '../config/sequelize';
import { QueryTypes } from 'sequelize';

const router = Router();

router.get('/stats', async (req, res) => {
  try {
    const { start, end, userId } = req.query;

    if (!start || !end) {
      return res.status(400).json({ error: 'Missing required query parameters: start and end' });
    }

    const p_start = new Date(start as string);
    const p_end = new Date(end as string);

    if (isNaN(p_start.getTime()) || isNaN(p_end.getTime())) {
      return res.status(400).json({ error: 'Invalid date format' });
    }

    let query = `
      SELECT
        COUNT(CASE WHEN "entryTime" >= $1 AND "entryTime" <= $2 THEN 1 END) AS "entries",
        COUNT(CASE WHEN "exitTime" >= $1 AND "exitTime" <= $2 THEN 1 END) AS "exits"
      FROM "ParkingSessions"
    `;

    const bindParams: any[] = [p_start.toISOString(), p_end.toISOString()];

    if (userId) {
      query += ` WHERE "userId" = $3`;
      bindParams.push(userId);
    }

    const [results] = await sequelize.query(query, {
      bind: bindParams,
      type: QueryTypes.SELECT,
    });

    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;