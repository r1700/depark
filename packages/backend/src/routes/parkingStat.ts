import { Router } from 'express';
import sequelize from '../config/sequelize';
import { QueryTypes } from 'sequelize';

const router = Router();
const TIMEZONE = 'Asia/Jerusalem';

router.get('/stats', async (req, res) => {
  try {
    const { userId, day, date } = req.query;
    const useDay = day === 'true';
    const dateParam = typeof date === 'string' ? date : undefined;

    // אם קיבלנו date -> אנו רוצים פירוק לפי שעות של אותו יום -> force hour grouping
    const groupingByHour = !!dateParam || !useDay;

    // פורמט למחרוזת להצגה: day או hour (אם groupingByHour true -> hour)
    const sqlDateFormatEntry = groupingByHour
      ? `to_char(entry_time AT TIME ZONE '${TIMEZONE}', 'YYYY-MM-DD HH24:00')`
      : `to_char(entry_time AT TIME ZONE '${TIMEZONE}', 'YYYY-MM-DD')`;

    const sqlDateFormatExit = groupingByHour
      ? `to_char(exit_time AT TIME ZONE '${TIMEZONE}', 'YYYY-MM-DD HH24:00')`
      : `to_char(exit_time AT TIME ZONE '${TIMEZONE}', 'YYYY-MM-DD')`;

    // date-only expressions for filtering by day (used when dateParam provided)
    const sqlDateOnlyEntry = `to_char(entry_time AT TIME ZONE '${TIMEZONE}', 'YYYY-MM-DD')`;
    const sqlDateOnlyExit = `to_char(exit_time AT TIME ZONE '${TIMEZONE}', 'YYYY-MM-DD')`;

    // build bind params and WHERE clauses safely
    const bindParams: any[] = [];
    const makeParam = (val: any) => {
      bindParams.push(val);
      return `$${bindParams.length}`;
    };

    const conditionsEntry: string[] = [];
    const conditionsExit: string[] = [];

    if (userId) {
      const p = makeParam(userId);
      conditionsEntry.push(`baseuser_id = ${p}`);
      conditionsExit.push(`baseuser_id = ${p}`);
    }

    if (dateParam) {
      // filter events that are on the requested date (compare date-only)
      const p = makeParam(dateParam);
      conditionsEntry.push(`${sqlDateOnlyEntry} = ${p}`);
      conditionsExit.push(`${sqlDateOnlyExit} = ${p}`);
    }

    const whereEntry = conditionsEntry.length ? `WHERE ${conditionsEntry.join(' AND ')}` : '';
    const whereExit = conditionsExit.length ? `WHERE ${conditionsExit.join(' AND ')}` : '';

    const query = `
      WITH events AS (
        SELECT ${sqlDateFormatEntry} AS period_str,
               ${groupingByHour ? `date_trunc('hour', entry_time AT TIME ZONE '${TIMEZONE}')` : `date_trunc('day', entry_time AT TIME ZONE '${TIMEZONE}')`} AS period_ts,
               1 AS entry_count,
               0 AS exit_count
        FROM parkingsessions
        ${whereEntry}

        UNION ALL

        SELECT ${sqlDateFormatExit} AS period_str,
               ${groupingByHour ? `date_trunc('hour', exit_time AT TIME ZONE '${TIMEZONE}')` : `date_trunc('day', exit_time AT TIME ZONE '${TIMEZONE}')`} AS period_ts,
               0 AS entry_count,
               1 AS exit_count
        FROM parkingsessions
        ${whereExit}
      )
      SELECT period_str AS period,
             SUM(entry_count) AS entries,
             SUM(exit_count)  AS exits,
             MAX(period_ts)   AS period_ts
      FROM events
      GROUP BY period_str
      ORDER BY period_ts DESC
    `;

    const results = await sequelize.query(query, {
      bind: bindParams,
      type: QueryTypes.SELECT,
    });

    const formattedResults = (results as any[]).map((r: any) => ({
      period: r.period,
      entries: Number(r.entries) || 0,
      exits: Number(r.exits) || 0,
    }));

    res.json(formattedResults);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;