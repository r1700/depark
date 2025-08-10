
// בס"ד

import express from 'express';
import isVehicleAllowed from '../services/vehicle-lookup/vehicleLookup';

const router = express.Router();

router.post('/lookup', async (req, res) => {
  const { licensePlate, timestamp, opcRequestId, lotId } = req.body;

  if (!licensePlate || !timestamp || !opcRequestId || !lotId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const result = await isVehicleAllowed({
      licensePlate,
      timestamp: new Date(timestamp),
      opcRequestId,
      lotId: Number(lotId),
    });

    return res.json(result);
  } catch (err) {
    console.error('API Error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
