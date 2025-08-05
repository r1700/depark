import { Router } from 'express';
import ParkingConfiguration from '../models/ParkingConfiguration';
const router = Router();

// יצירה (INSERT בלבד)
router.post('/', async (req, res) => {
  try {
    const { parkingConfig } = req.body;
    if (!parkingConfig || !parkingConfig.lotId) {
      return res.status(400).json({ success: false, error: 'Missing parkingConfig or lotId' });
    }

    // בדוק אם כבר קיים
    const exists = await ParkingConfiguration.findByPk(parkingConfig.lotId);
    if (exists) {
      return res.status(409).json({ success: false, error: 'Lot ID already exists' });
    }

    // יצירת רשומה חדשה
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

// עדכון (UPDATE בלבד)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { parkingConfig } = req.body;
    if (!parkingConfig) {
      return res.status(400).json({ success: false, error: 'Missing parkingConfig' });
    }

    // בדוק אם קיים
    const exists = await ParkingConfiguration.findByPk(id);
    if (!exists) {
      return res.status(404).json({ success: false, error: 'Lot ID not found' });
    }

    // עדכון הרשומה
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

// קבלת חניון לפי מזהה (ID)
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

// קבלת כל החניונים
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