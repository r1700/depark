import { Router } from 'express';
import ParkingConfiguration from '../models/ParkingConfiguration';
const router = Router();

// Create (INSERT only)
router.post('/', async (req, res) => {
  try {
    const { parkingConfig } = req.body;
    if (!parkingConfig || !parkingConfig.lotId) {
      return res.status(400).json({ success: false, error: 'Missing parkingConfig or lotId' });
    }

    // Check if already exists
    const exists = await ParkingConfiguration.findByPk(parkingConfig.lotId);
    if (exists) {
      return res.status(409).json({ success: false, error: 'Lot ID already exists' });
    }

    // Create new record
    await ParkingConfiguration.create({
      id: parkingConfig.lotId,
      facilityName: parkingConfig.facilityName,
      totalSpots: parkingConfig.totalSpots,
      surfaceSpotIds: parkingConfig.surfaceSpotIds,
      avgRetrievalTimeMinutes: parkingConfig.avgRetrievalTimeMinutes,
      maxQueueSize: parkingConfig.maxQueueSize,
      operatingHours: parkingConfig.operatingHours,
      timezone: parkingConfig.timezone,
      updatedBy: parkingConfig.updatedBy || 'admin'
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error saving parking config:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Update (UPDATE only)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { parkingConfig } = req.body;
    if (!parkingConfig) {
      return res.status(400).json({ success: false, error: 'Missing parkingConfig' });
    }

    // Check if exists
    const exists = await ParkingConfiguration.findByPk(id);
    if (!exists) {
      return res.status(404).json({ success: false, error: 'Lot ID not found' });
    }

    // Update record
    await exists.update({
      facilityName: parkingConfig.facilityName,
      totalSpots: parkingConfig.totalSpots,
      surfaceSpotIds: parkingConfig.surfaceSpotIds,
      avgRetrievalTimeMinutes: parkingConfig.avgRetrievalTimeMinutes,
      maxQueueSize: parkingConfig.maxQueueSize,
      operatingHours: parkingConfig.operatingHours,
      timezone: parkingConfig.timezone,
      updatedBy: parkingConfig.updatedBy || 'admin'
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error updating parking config:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Get parking lot by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const parkingConfig = await ParkingConfiguration.findByPk(id);
    
    if (!parkingConfig) {
      return res.status(404).json({ success: false, error: 'Lot ID not found' });
    }
    
    res.json({ success: true, parkingConfig });
  } catch (error) {
    console.error('Error fetching parking config:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Get all parking lots
router.get('/', async (req, res) => { 
  try {
    const parkingConfigs = await ParkingConfiguration.findAll();
    res.json({ success: true, parkingConfigs });
  } catch (error) {
    console.error('Error fetching parking configs:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

export default router;