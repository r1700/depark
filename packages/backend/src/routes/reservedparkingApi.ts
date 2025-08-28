import { Router, Request, Response } from 'express';
import {
  getAllReservedParking,
  addReservedParking,
  updateReservedParking,
  deleteReservedParking,
  handleReservedParkingFilter
} from '../services/reservedparkingServices';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  const hasFilters = Object.keys(req.query).length > 0;
  if (hasFilters) {
    return handleReservedParkingFilter(req, res);
  }
  try {
    const reservedParking = await getAllReservedParking();
    res.json(reservedParking);
  } catch (error) {
    console.error('Error in GET /api/reservedparking:', error);
    res.status(500).json({ error: 'Failed to fetch reserved parking' });
  }
});

// POST /api/reservedparking/add
router.post('/add', async (req: Request, res: Response) => {
  try {
    const newRow = await addReservedParking(req.body);
    res.json({ success: true, data: newRow });
  } catch (error) {
    console.error('Error in POST /api/reservedparking/add:', error);
    res.status(500).json({ error: 'Failed to add reserved parking' });
  }
});

// PUT /api/reservedparking/update
router.put('/update', async (req: Request, res: Response) => {
  try {
    const { id, baseuser_id, parking_number, day_of_week } = req.body;
    if (!id) {
      return res.status(400).json({ error: 'Missing id for update' });
    }
    const updatedRow = await updateReservedParking(id, {
      baseuser_id,
      parking_number,
      day_of_week
    });
    res.json({ success: true, data: updatedRow });
  } catch (error) {
    console.error('Error in PUT /api/reservedparking/update:', error);
    res.status(500).json({ error: 'Failed to update reserved parking' });
  }
});

// DELETE /api/reservedparking/:id
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'Invalid id parameter' });
    }

    const deleted = await deleteReservedParking(id);

    res.json({ success: true, data: deleted });
  } catch (error) {
    console.error(`Error in DELETE /api/reservedparking/${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to delete reserved parking' });
  }
});

export default router;