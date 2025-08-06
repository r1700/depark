import { Router } from 'express';
import { ParkingConfigurationModel } from '../model/systemConfiguration/parkingConfiguration';
import ParkingConfiguration from '../models/ParkingConfiguration'; // Keep for database operations
const router = Router();

// Helper function to convert between your model and database model
function convertToDbFormat(config: any) {
  return {
    id: config.lotId || config.id,
    facilityName: config.facilityName,
    totalSpots: config.totalSpots,
    surfaceSpotIds: config.surfaceSpotIds,
    avgRetrievalTimeMinutes: config.avgRetrievalTimeMinutes || config.avgRetrievalTime,
    maxQueueSize: config.maxQueueSize,
    maxParallelRetrievals: config.maxParallelRetrievals,
    operatingHours: config.operatingHours || config.dailyHours,
    timezone: config.timezone,
    maintenanceMode: config.maintenanceMode,
    showAdminAnalytics: config.showAdminAnalytics,
    updatedAt: config.updatedAt || new Date(),
    updatedBy: config.updatedBy || 'admin'
  };
}

function convertFromDbFormat(dbConfig: any) {
  return {
    id: dbConfig.id,
    facilityName: dbConfig.facilityName,
    totalSpots: dbConfig.totalSpots,
    surfaceSpotIds: dbConfig.surfaceSpotIds,
    avgRetrievalTimeMinutes: dbConfig.avgRetrievalTimeMinutes,
    maxQueueSize: dbConfig.maxQueueSize,
    maxParallelRetrievals: dbConfig.maxParallelRetrievals,
    operatingHours: dbConfig.operatingHours,
    timezone: dbConfig.timezone,
    maintenanceMode: dbConfig.maintenanceMode,
    showAdminAnalytics: dbConfig.showAdminAnalytics,
    updatedAt: dbConfig.updatedAt,
    updatedBy: dbConfig.updatedBy
  };
}

// Create (INSERT only) with validation using your model
router.post('/', async (req, res) => {
  try {
    const { parkingConfig } = req.body;
    if (!parkingConfig || !parkingConfig.lotId) {
      return res.status(400).json({ success: false, error: 'Missing parkingConfig or lotId' });
    }

    // Use your validation model first
    try {
      const validatedConfig = await ParkingConfigurationModel.create(convertToDbFormat(parkingConfig));
      console.log('✅ Validation passed with your model:', validatedConfig);
    } catch (error: any) {
      console.log('❌ Validation failed:', error);
      return res.status(400).json({ success: false, error: 'Validation failed: ' + error.message });
    }

    // Check if already exists
    const exists = await ParkingConfiguration.findByPk(parkingConfig.lotId);
    if (exists) {
      return res.status(409).json({ success: false, error: 'Lot ID already exists' });
    }

    // Create new record in database
    const dbData = convertToDbFormat(parkingConfig);
    await ParkingConfiguration.create(dbData);

    res.json({ success: true });
  } catch (error) {
    console.error('Error saving parking config:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Update (UPDATE only) with validation using your model
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { parkingConfig } = req.body;
    if (!parkingConfig) {
      return res.status(400).json({ success: false, error: 'Missing parkingConfig' });
    }

    // Use your validation model first
    try {
      const validatedConfig = await ParkingConfigurationModel.create(convertToDbFormat(parkingConfig));
      console.log('✅ Validation passed with your model:', validatedConfig);
    } catch (error: any) {
      console.log('❌ Validation failed:', error);
      return res.status(400).json({ success: false, error: 'Validation failed: ' + error.message });
    }

    // Check if exists
    const exists = await ParkingConfiguration.findByPk(id);
    if (!exists) {
      return res.status(404).json({ success: false, error: 'Lot ID not found' });
    }

    // Update record in database
    const dbData = convertToDbFormat(parkingConfig);
    await exists.update(dbData);

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
    
    // Convert to your model format
    const configData = convertFromDbFormat(parkingConfig.toJSON());
    res.json({ success: true, parkingConfig: configData });
  } catch (error) {
    console.error('Error fetching parking config:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Get all parking lots
router.get('/', async (req, res) => { 
  try {
    const parkingConfigs = await ParkingConfiguration.findAll();
    
    // Convert all to your model format
    const configsData = parkingConfigs.map(config => convertFromDbFormat(config.toJSON()));
    res.json({ success: true, parkingConfigs: configsData });
  } catch (error) {
    console.error('Error fetching parking configs:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Delete parking lot
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const parkingConfig = await ParkingConfiguration.findByPk(id);
    
    if (!parkingConfig) {
      return res.status(404).json({ success: false, error: 'Lot ID not found' });
    }
    
    await parkingConfig.destroy();
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting parking config:', error); 
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

export default router;