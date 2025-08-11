import { Router } from 'express';
import sequelize from '../config/sequelize';
import { QueryTypes } from 'sequelize';
import { toZonedTime, format } from 'date-fns-tz';

const router = Router();

const TIMEZONE = 'Asia/Jerusalem';

router.get('/stats', async (req, res) => {
  try {
    const { userId, day } = req.query;
    const useDay = day === 'true';

    const now = new Date();
    let p_start: Date;
    let p_end = now;

    if (useDay) {
      p_start = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000); // 10 ימים אחורה
    } else {
      p_start = new Date(now.getTime() - 10 * 60 * 60 * 1000); // 10 שעות אחורה
    }

    let userCondition = '';
    const bindParams: any[] = [p_start.toISOString(), p_end.toISOString()];

    if (userId) {
      userCondition = ` AND "userId" = $3`;
      bindParams.push(userId);
    }

    const dateTrunc = useDay ? 'day' : 'hour';

    const query = `
      SELECT 
        date_trunc('${dateTrunc}', "entryTime") AS period,
        COUNT(*) FILTER (WHERE "entryTime" >= $1 AND "entryTime" <= $2) AS "entries",
        COUNT(*) FILTER (WHERE "exitTime" >= $1 AND "exitTime" <= $2) AS "exits"
      FROM "ParkingSessions"
      WHERE (("entryTime" >= $1 AND "entryTime" <= $2)
          OR ("exitTime" >= $1 AND "exitTime" <= $2))
        ${userCondition}
      GROUP BY period
      ORDER BY period DESC
      LIMIT 10
    `;

    const results = await sequelize.query(query, {
      bind: bindParams,
      type: QueryTypes.SELECT,
    });

    // המרה של כל תאריך לשעון ישראל ופורמט לפי יום או שעה
    const formattedResults = results.map((r: any) => {
      const zonedDate = toZonedTime(r.period, TIMEZONE);

      if (useDay) {
        // פורמט YYYY-MM-DD
        return {
          period: format(zonedDate, 'yyyy-MM-dd', { timeZone: TIMEZONE }),
          entries: Number(r.entries),
          exits: Number(r.exits),
        };
      } else {
        // פורמט YYYY-MM-DD HH:00
        return {
          period: format(zonedDate, 'yyyy-MM-dd HH:00', { timeZone: TIMEZONE }),
          entries: Number(r.entries),
          exits: Number(r.exits),
        };
      }
    });

    res.json(formattedResults);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;