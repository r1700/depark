
// בס"ד

import express, { Router } from 'express';
import isVehicleAllowed from '../services/vehicle-lookup/vehicleLookup';

const router : Router= express.Router();

router.post('/lookup', async (req, res) => {
  const { licensePlate, timestamp, opcRequestId, lotId } = req.body;

  if (!licensePlate || !timestamp || !lotId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const result = await isVehicleAllowed([
      licensePlate,
      new Date(timestamp),
      opcRequestId,
      Number(lotId),
    ]);

    return res.json(result);
  } catch (err) {
    console.error('API Error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
