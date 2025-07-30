// src/routes/admin-config.ts
import { Router } from 'express';

const router = Router();

// טיפוסים זמניים (עד שתיצרי את קובץ הטיפוסים)
interface ParkingConfiguration {
  id: string;
  facilityName: string;
  timezone: string;
  totalSurfaceSpots: number;
  surfaceSpotIds: string[];
  operatingHours: {
    start: string;
    end: string;
  };
  activeDays?: string[];
  maxQueueSize: number;
  avgRetrievalTimeMinutes: number;
  maxParallelRetrievals?: number;
  updatedAt: Date;
  updatedBy: string;
}

interface SystemSettings {
  maintenance_mode: boolean;
  show_admin_analytics: boolean;
  updatedAt: Date;
  updatedBy: string;
}

// Mock data
let mockParkingConfig: ParkingConfiguration = {
  id: 'main-lot',
  facilityName: 'Main Parking Facility',
  timezone: 'Asia/Jerusalem',
  totalSurfaceSpots: 50,
  surfaceSpotIds: ['S1', 'S2', 'S3', 'S4', 'S5'],
  operatingHours: {
    start: '07:00',
    end: '22:00'
  },
  activeDays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
  maxQueueSize: 10,
  avgRetrievalTimeMinutes: 2.5,
  maxParallelRetrievals: 3,
  updatedAt: new Date(),
  updatedBy: 'admin'
};

let mockSystemSettings: SystemSettings = {
  maintenance_mode: false,
  show_admin_analytics: true,
  updatedAt: new Date(),
  updatedBy: 'admin'
};

// GET /api/admin/config
router.get('/config', async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        parkingConfig: mockParkingConfig,
        systemSettings: mockSystemSettings
      }
    });
  } catch (error) {
    console.error('Error fetching admin config:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// PUT /api/admin/config
router.put('/config', async (req, res) => {
  try {
    const { parkingConfig, systemSettings } = req.body;

    // ולידציות בסיסיות
    if (!validateParkingConfig(parkingConfig)) {
      return res.status(400).json({ success: false, error: 'Invalid parking configuration' });
    }

    const now = new Date();
    console.log('🔄 Updating config at:', now.toISOString()); // לוג!

    // עדכון המידע
    mockParkingConfig = {
      ...parkingConfig,
      updatedAt: now, // ודא שזה מתעדכן!
      updatedBy: 'admin'
    };

    mockSystemSettings = {
      ...systemSettings,
      updatedAt: now, // גם כאן!
      updatedBy: 'admin'
    };

    console.log('✅ Config updated:', {
      parkingUpdated: mockParkingConfig.updatedAt,
      systemUpdated: mockSystemSettings.updatedAt
    });

    res.json({
      success: true,
      data: {
        parkingConfig: mockParkingConfig,
        systemSettings: mockSystemSettings
      }
    });
  } catch (error) {
    console.error('Error updating admin config:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// פונקציית ולידציה
function validateParkingConfig(config: any): boolean {
  if (!config) return false;
  
  // בדיקת פורמט זמן HH:mm
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  
  if (!timeRegex.test(config.operatingHours?.start) || 
      !timeRegex.test(config.operatingHours?.end)) {
    return false;
  }

  // בדיקות נוספות
  if (config.totalSurfaceSpots < 0 || config.maxQueueSize < 0) {
    return false;
  }

  return true;
}

export default router;