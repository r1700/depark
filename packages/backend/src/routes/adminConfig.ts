import { Router } from 'express';
import { ParkingConfigurationModel } from '../model/systemConfiguration/parkingConfiguration';
import ParkingConfiguration from '../models/ParkingConfiguration';
import authenticateToken from '../middlewares/authMiddleware'; // Back to original auth

const router = Router();
router.post('/', authenticateToken, async (req, res) => {
  const { parkingConfig } = req.body;
  if (!parkingConfig) {
    return res.status(400).json({ success: false, error: 'Missing parkingConfig' });
  }

  try {
    console.log('🔍 Raw parkingConfig data:', JSON.stringify(parkingConfig, null, 2));
      
      const configForValidation = { ...parkingConfig };
      delete configForValidation.id;
      delete configForValidation.lotId;
      
      console.log('🔄 Config after removing IDs for validation:', JSON.stringify(configForValidation, null, 2));
      
      const { error, value: validatedConfig } = ParkingConfigurationModel.schema.validate(configForValidation);
      if (error) {
        console.log('❌ Validation failed:', error);
        console.log('❌ Error details:', error.details);
        return res.status(400).json({ success: false, error: 'Validation failed: ' + error.message });
      }
      console.log('✅ Validation passed with your model:', validatedConfig);

      const configForDatabase = { ...parkingConfig }; 
      delete configForDatabase.id;
      delete configForDatabase.lotId;
      
      // Add updated timestamp and user from authentication
      configForDatabase.updatedAt = new Date();
      const currentUser = (req as any).user;
      configForDatabase.updatedBy = currentUser.email || `user_${currentUser.id}`;
      
      console.log('🔄 Config for database insertion:', JSON.stringify(configForDatabase, null, 2));

      console.log('⏳ About to create record in database...');
      // Create new record in database - הID יווצר אוטומטית
      const newRecord = await ParkingConfiguration.create(configForDatabase);

      res.json({ success: true, id: newRecord.id });
  } catch (error) {
    console.error('Error saving parking config:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { parkingConfig } = req.body;
    if (!parkingConfig) {
      return res.status(400).json({ success: false, error: 'Missing parkingConfig' });
    }

    const configForValidation = { ...parkingConfig };
    delete configForValidation.id;
    delete configForValidation.lotId;
    
    const { error, value: validatedConfig } = ParkingConfigurationModel.schema.validate(configForValidation);
    if (error) {
      console.log('❌ Validation failed:', error);
      return res.status(400).json({ success: false, error: 'Validation failed: ' + error.message });
    }
    console.log('✅ Validation passed with your model:', validatedConfig);

    const exists = await ParkingConfiguration.findByPk(id);
    if (!exists) {
      return res.status(404).json({ success: false, error: 'ID not found' });
    }

    // Use the validated config for updating, which includes auto-generated fields
    const configForDatabase = { ...parkingConfig };
    delete configForDatabase.id;
    delete configForDatabase.lotId;
    
    // Add updated timestamp and user from authentication
    configForDatabase.updatedAt = new Date();
    const currentUser = (req as any).user;
    configForDatabase.updatedBy = currentUser.email || `user_${currentUser.id}`;

    await exists.update(configForDatabase);

    res.json({ success: true });
  } catch (error: any) {
    console.error('Error updating parking config:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

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