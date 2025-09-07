import express from 'express';
const router = express.Router();
import { Vehicle } from '../model/database-models/vehicle.model'; 

router.get('/employee', async (req, res) => {
  const { baseuser_id } = req.query;
  if (!baseuser_id) {
    return res.status(400).json({ error: 'Missing base user ID' });
  }
  try {
    const vehicle = await Vehicle.findOne({ where: { baseuser_id } });
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }
    res.json(vehicle);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;