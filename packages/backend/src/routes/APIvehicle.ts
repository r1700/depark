import { Router, Request, Response } from 'express';
import {
  getAllVehicles,
} from '../services/APIvehicle';
import client from '../db/connection';

import cors from 'cors';
import express from 'express';
const app = express();
app.use(cors());
app.use(express.json());

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const vehicles = await getAllVehicles();
    res.status(200).json({ success: true, vehicles });
  } catch (error: any) {
    console.error('Error fetching all vehicles:', error);
    res.status(500).json({ success: false, error: error.message || 'Internal server error' });
  }
});

router.get('/filterVehicles', async (req: Request, res: Response) => {
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

    if (typeof is_active === 'string' && (is_active.toLowerCase() === 'true' || is_active.toLowerCase() === 'false')) {
      const boolVal = is_active.toLowerCase() === 'true';
      query += ` AND v.is_active = $${idx}`;
      values.push(boolVal);
      idx++;
    }

    if (typeof is_currently_parked === 'string' && (is_currently_parked.toLowerCase() === 'true' || is_currently_parked.toLowerCase() === 'false')) {
      const boolVal = is_currently_parked.toLowerCase() === 'true';
      query += ` AND v.is_currently_parked = $${idx}`;
      values.push(boolVal);
      idx++;
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

    const { rows } = await client.query(query, values);

    if (!rows || rows.length === 0) {
      return res.status(404).json({ success: false, error: 'No vehicles found with the specified filters' });
    }

    return res.status(200).json({ success: true, vehicles: rows });
  } catch (error: any) {
    console.error('Database error:', error);
    return res.status(500).json({ success: false, error: error.message || 'Internal server error' });
  }
});

export default router;