const express = require('express');
const mockParkingLimitDB = require('../mockParkingLimitDB');
const router = express.Router();

// קבל מגבלת חניות
router.get('/parking-limit', async (req, res) => {
  try {
    console.log('📊 API: Getting parking limit...');
    const result = await mockParkingLimitDB.getMaxParkingSpots();
    res.json(result);
  } catch (error) {
    console.error('❌ Error getting parking limit:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to get parking limit',
      maxSpots: 25 // fallback
    });
  }
});

// עדכן מגבלת חניות (רק אדמין)
router.put('/parking-limit', async (req, res) => {
  try {
    const { maxSpots } = req.body;
    
    console.log(`🔧 API: Updating parking limit to ${maxSpots}...`);
    
    if (!maxSpots || maxSpots < 1) {
      return res.status(400).json({
        success: false,
        error: 'maxSpots must be a positive number'
      });
    }
    
    const result = await mockParkingLimitDB.updateMaxParkingSpots(maxSpots);
    res.json(result);
  } catch (error) {
    console.error('❌ Error updating parking limit:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update parking limit' 
    });
  }
});

module.exports = router;