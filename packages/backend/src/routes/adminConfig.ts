import { Router } from 'express';
import { ParkingConfigurationModel } from '../model/systemConfiguration/parkingConfiguration';
import ParkingConfiguration from '../models/ParkingConfiguration';
const router = Router();

// Create (INSERT only) with validation using your model
router.post('/', async (req, res) => {
  try {
    const { parkingConfig } = req.body;
    if (!parkingConfig) {
      return res.status(400).json({ success: false, error: 'Missing parkingConfig' });
    }

    // Use your validation model first
    try {
      const validatedConfig = await ParkingConfigurationModel.create(parkingConfig);
      console.log('✅ Validation passed with your model:', validatedConfig);
    } catch (error: any) {
      console.log('❌ Validation failed:', error);
      return res.status(400).json({ success: false, error: 'Validation failed: ' + error.message });
    }

    // Check if already exists (using id from validated data)
    const exists = await ParkingConfiguration.findByPk(parkingConfig.id);
    if (exists) {
      return res.status(409).json({ success: false, error: 'ID already exists' });
    }

    // Create new record in database using the original data
    await ParkingConfiguration.create(parkingConfig);

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
      const validatedConfig = await ParkingConfigurationModel.create(parkingConfig);
      console.log('✅ Validation passed with your model:', validatedConfig);
    } catch (error: any) {
      console.log('❌ Validation failed:', error);
      return res.status(400).json({ success: false, error: 'Validation failed: ' + error.message });
    }

    // Check if exists
    const exists = await ParkingConfiguration.findByPk(id);
    if (!exists) {
      return res.status(404).json({ success: false, error: 'ID not found' });
    }

    // Update record in database using the original data
    await exists.update(parkingConfig);

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
      return res.status(404).json({ success: false, error: 'ID not found' });
    }
    
    // Return the data directly from database
    res.json({ success: true, parkingConfig: parkingConfig.toJSON() });
  } catch (error) {
    console.error('Error fetching parking config:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Get all parking lots
router.get('/', async (req, res) => { 
  try {
    const parkingConfigs = await ParkingConfiguration.findAll();
    
    // Return all data directly from database
    const configsData = parkingConfigs.map(config => config.toJSON());
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