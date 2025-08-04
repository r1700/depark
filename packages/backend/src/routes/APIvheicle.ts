import { Router, Request, Response } from 'express';
import { getAllVehicles, getVehiclesByUserId } from '../services/APIvehicle';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const vehicles = await getAllVehicles();
    res.status(200).json({ success: true, vehicles});
  } catch (error: any) {
    console.error('Error fetching all vehicles:', error);
    res.status(500).json({ success: false, error: error.message || 'Internal server error' });
  }
});

router.get('/:baseuserId', async (req: Request, res: Response) => {
  const { baseuserId } = req.params;

  try {
    const vehicles = await getVehiclesByUserId(baseuserId);

    if (!vehicles || vehicles.length === 0) {
      return res.status(404).json({ success: false, error: 'No vehicles found for this user' });
    }

    res.status(200).json({ success: true, vehicles });
  } catch (error: any) {
    console.error(`Error fetching vehicles for user ${baseuserId}:`, error);
    res.status(500).json({ success: false, error: error.message || 'Internal server error' });
  }
});

export default router;