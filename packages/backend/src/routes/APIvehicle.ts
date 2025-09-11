import { Router, Request, Response } from 'express';
import sequelize from '../config/sequelize';
import { QueryTypes } from 'sequelize';

const router: Router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const { search, is_active, is_currently_parked, created_at, updated_at } = req.query;

    let query = `
      SELECT
        v.id,
        v.license_plate,
        v.is_active,
        v.is_currently_parked,
        v.created_at,
        v.updated_at,
        CONCAT(bu.first_name, ' ', bu.last_name) as baseuser_name,
        bu.email,
        u.phone
      FROM vehicles v
      LEFT JOIN baseuser bu ON v.baseuser_id = bu.id
      LEFT JOIN users u ON bu.id = u.baseuser_id
      WHERE 1=1
    `;

    const values: any[] = [];
    let idx = 1;

    if (typeof search === 'string' && search.trim() !== '') {
      query += ` AND (
        CONCAT(bu.first_name, ' ', bu.last_name) ILIKE $${idx} OR
        v.license_plate ILIKE $${idx} OR
        u.phone ILIKE $${idx} OR
        bu.email ILIKE $${idx}
      )`;
      values.push(`%${search.trim()}%`);
      idx++;
    }

    if (typeof is_active === 'string') {
      const s = is_active.toLowerCase();
      if (s === 'true' || s === 'false') {
        const boolVal = s === 'true';
        query += ` AND v.is_active = $${idx}`;
        values.push(boolVal);
        idx++;
      }
    }

    if (typeof is_currently_parked === 'string') {
      const s = is_currently_parked.toLowerCase();
      if (s === 'true' || s === 'false') {
        const boolVal = s === 'true';
        query += ` AND v.is_currently_parked = $${idx}`;
        values.push(boolVal);
        idx++;
      }
    }

    if (typeof created_at === 'string' && created_at.trim() !== '') {
      query += ` AND DATE(v.created_at) = $${idx}`;
      values.push(created_at.trim());
      idx++;
    }

    if (typeof updated_at === 'string' && updated_at.trim() !== '') {
      query += ` AND DATE(v.updated_at) = $${idx}`;
      values.push(updated_at.trim());
      idx++;
    }

    query += ` ORDER BY v.id ASC`;

    const vehicles = await sequelize.query(query, {
      bind: values,
      type: QueryTypes.SELECT,
    });

    return res.status(200).json({ success: true, vehicles, filters: req.query });
  } catch (error: any) {
    console.error('Database error:', error);
    return res.status(500).json({ success: false, error: error.message || 'Internal server error' });
  }
});

export default router;