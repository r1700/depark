import { Router, Request, Response } from 'express';
import { getAllVehicles, getVehicleByCreatedAt, getVehicleByIsActive, getVehicleByIsCurrentlyParked,
 getVehicleByLicensePlate, getVehiclesByUpdatedAt, getVehiclesByUserId } from '../services/APIvehicle';

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

router.get('/:userId', async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const vehicles = await getVehiclesByUserId(userId);

    if (!vehicles || vehicles.length === 0) {
      return res.status(404).json({ success: false, error: 'No vehicles found for this user' });
    }

    res.status(200).json({ success: true, vehicles });
  } catch (error: any) {
    console.error(`Error fetching vehicles for user ${userId}:`, error);
    res.status(500).json({ success: false, error: error.message || 'Internal server error' });
  }
});

router.get('/license/:licensePlate', async (req: Request, res: Response) => {
  const { licensePlate } = req.params;

  try {
    const vehicle = await getVehicleByLicensePlate(licensePlate);

    if (!vehicle) {
      return res.status(404).json({ success: false, error: 'Vehicle not found' });
    }

    res.status(200).json({ success: true, vehicle });
  } catch (error: any) {
    console.error(`Error fetching vehicle by license plate ${licensePlate}:`, error);
    res.status(500).json({ success: false, error: error.message || 'Internal server error' });
  }
});

router.get('/active/:isActive', async (req: Request, res: Response) => {
  const { isActive } = req.params;

  try {
    const vehicle = await getVehicleByIsActive(isActive === 'true');

    if (!vehicle) {
      return res.status(404).json({ success: false, error: 'No active vehicle found' });
    }

    res.status(200).json({ success: true, vehicle });
  } catch (error: any) {
    console.error(`Error fetching active vehicle status ${isActive}:`, error);
    res.status(500).json({ success: false, error: error.message || 'Internal server error' });
  }
});

router.get('/currently-parked/:isCurrentlyParked', async (req: Request, res: Response) => {
  const { isCurrentlyParked } = req.params;

  try {
    const vehicle = await getVehicleByIsCurrentlyParked(isCurrentlyParked === 'true');

    if (!vehicle) {
      return res.status(404).json({ success: false, error: 'No vehicle currently parked found' });
    }

    res.status(200).json({ success: true, vehicle });
  } catch (error: any) {
    console.error(`Error fetching currently parked vehicle status ${isCurrentlyParked}:`, error);
    res.status(500).json({ success: false, error: error.message || 'Internal server error' });
  }
});

router.get('/created-at/:createdAt', async (req: Request, res: Response) => {
  const { createdAt } = req.params;

  try {
    const vehicles = await getVehicleByCreatedAt(createdAt);

    if (!vehicles || vehicles.length === 0) {
      return res.status(404).json({ success: false, error: 'No vehicles found for this creation date' });
    }

    res.status(200).json({ success: true, vehicles });
  } catch (error: any) {
    console.error(`Error fetching vehicles by creation date ${createdAt}:`, error);
    res.status(500).json({ success: false, error: error.message || 'Internal server error' });
  }
});

router.get('/updated-at/:updatedAt', async (req: Request, res: Response) => {
  const { updatedAt } = req.params;

  try {
    const vehicles = await getVehiclesByUpdatedAt(updatedAt);

    if (!vehicles || vehicles.length === 0) {
      return res.status(404).json({ success: false, error: 'No vehicles found for this update date' });
    }

    res.status(200).json({ success: true, vehicles });
  } catch (error: any) {
    console.error(`Error fetching vehicles by update date ${updatedAt}:`, error);
    res.status(500).json({ success: false, error: error.message || 'Internal server error' });
  }
});

export default router;