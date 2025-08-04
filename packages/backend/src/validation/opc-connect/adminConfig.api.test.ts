import request from 'supertest';
import express from 'express';
import ParkingConfiguration from '../../models/ParkingConfiguration';
import adminConfigRouter from '../../routes/adminConfig';

// Mock the auth middleware
jest.mock('../middlewares/authMiddleware', () => {
  return jest.fn((req: any, res: any, next: any) => {
    // Add mock user to request
    req.user = {
      id: 1,
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User'
    };
    next();
  });
});

describe('adminConfig API', () => {
  const app = express();
  app.use(express.json());
  app.use('/api/admin', adminConfigRouter);

  // Mock console.error to suppress error logs during testing
  const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

  // Setup test data before all tests
  beforeAll(async () => {
    // Clean up any existing test data first by facility name
    await ParkingConfiguration.destroy({
      where: {
        facilityName: {
          [require('sequelize').Op.like]: 'Test%'
        }
      }
    });

    // Create test parking configurations
    await ParkingConfiguration.create({
      facilityName: 'Test Parking Facility 1',
      totalSpots: 100,
      surfaceSpotIds: ['TEST_spot1', 'TEST_spot2', 'TEST_spot3'],
      avgRetrievalTimeMinutes: 30,
      maxQueueSize: 10,
      operatingHours: { 
        Sunday: { isActive: true, openingHour: '08:00', closingHour: '18:00' },
        Monday: { isActive: true, openingHour: '08:00', closingHour: '18:00' },
        Tuesday: { isActive: true, openingHour: '08:00', closingHour: '18:00' },
        Wednesday: { isActive: true, openingHour: '08:00', closingHour: '18:00' },
        Thursday: { isActive: true, openingHour: '08:00', closingHour: '18:00' },
        Friday: { isActive: true, openingHour: '08:00', closingHour: '18:00' },
        Saturday: { isActive: false, openingHour: '00:00', closingHour: '00:00' }
      },
      timezone: 'Asia/Jerusalem',
      updatedBy: 'test-admin'
    });

    await ParkingConfiguration.create({
      facilityName: 'Test Parking Facility 2',
      totalSpots: 50,
      surfaceSpotIds: ['TEST_spot4', 'TEST_spot5'],
      avgRetrievalTimeMinutes: 25,
      maxQueueSize: 5,
      operatingHours: { 
        Sunday: { isActive: true, openingHour: '09:00', closingHour: '19:00' },
        Monday: { isActive: true, openingHour: '09:00', closingHour: '19:00' },
        Tuesday: { isActive: true, openingHour: '09:00', closingHour: '19:00' },
        Wednesday: { isActive: true, openingHour: '09:00', closingHour: '19:00' },
        Thursday: { isActive: true, openingHour: '09:00', closingHour: '19:00' },
        Friday: { isActive: true, openingHour: '09:00', closingHour: '19:00' },
        Saturday: { isActive: false, openingHour: '00:00', closingHour: '00:00' }
      },
      timezone: 'Asia/Jerusalem',
      updatedBy: 'test-admin'
    });
  });

  // Clean up test data after all tests
  afterAll(async () => {
    // Delete all test records with various test names
    await ParkingConfiguration.destroy({
      where: {
        facilityName: {
          [require('sequelize').Op.or]: [
            { [require('sequelize').Op.like]: 'Test%' },
            { [require('sequelize').Op.like]: '%Test%' },
            { [require('sequelize').Op.like]: 'New Test%' },
            { [require('sequelize').Op.like]: 'Error%' },
            { [require('sequelize').Op.like]: 'Minimal%' },
            { [require('sequelize').Op.like]: 'Updated%' },
            { [require('sequelize').Op.like]: 'To Be Deleted%' },
            { [require('sequelize').Op.like]: '%Test Parking%' }
          ]
        }
      }
    });
    
    consoleSpy.mockRestore();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // GET Tests
  it('GET /api/admin/ - should return all parking configs', async () => {
    const res = await request(app).get('/api/admin/');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('parkingConfigs');
    expect(Array.isArray(res.body.parkingConfigs)).toBe(true);
    expect(res.body.parkingConfigs.length).toBeGreaterThanOrEqual(2);
    
    // Check our test data exists
    const testData = res.body.parkingConfigs.filter((config: any) => config.facilityName.startsWith('Test'));
    expect(testData).toHaveLength(2);
    
    // Sort test data by facility name to ensure consistent order
    testData.sort((a: any, b: any) => a.facilityName.localeCompare(b.facilityName));
    expect(testData[0]).toHaveProperty('facilityName', 'Test Parking Facility 1');
    expect(testData[1]).toHaveProperty('facilityName', 'Test Parking Facility 2');
  });

  it('GET /api/admin/ - error during retrieval returns 500', async () => {
    // Temporarily break the database connection to simulate error
    const originalFindAll = ParkingConfiguration.findAll;
    ParkingConfiguration.findAll = jest.fn().mockRejectedValue(new Error('Database connection error'));

    const res = await request(app)
      .get('/api/admin/');
    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body).toHaveProperty('error', 'Internal server error');

    // Restore original function
    ParkingConfiguration.findAll = originalFindAll;
  });

  it('GET /api/admin/:id - not found returns 404', async () => {
    const res = await request(app).get('/api/admin/99999'); // Use numeric ID
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body).toHaveProperty('error', 'ID not found');
  });

  it('GET /api/admin/:id - ID exists returns 200', async () => {
    // First get all configs to find a valid ID
    const allConfigs = await ParkingConfiguration.findAll();
    const testConfig = allConfigs.find(config => config.facilityName.startsWith('Test'));
    
    if (!testConfig) {
      throw new Error('No test config found');
    }
    
    const res = await request(app).get(`/api/admin/${testConfig.id}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('parkingConfig');
    expect(res.body.parkingConfig).toHaveProperty('id', testConfig.id);
    expect(res.body.parkingConfig).toHaveProperty('facilityName', testConfig.facilityName);
  });

  it('GET /api/admin/:id - error during retrieval returns 500', async () => {
    // Temporarily break the database connection to simulate error  
    const originalFindByPk = ParkingConfiguration.findByPk;
    ParkingConfiguration.findByPk = jest.fn().mockRejectedValue(new Error('Database connection error'));
    
    const res = await request(app)
      .get('/api/admin/1'); // Use numeric ID
    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body).toHaveProperty('error', 'Internal server error');

    // Restore original function
    ParkingConfiguration.findByPk = originalFindByPk;
  });

  // POST Tests
  it('POST /api/admin/ - missing parkingConfig returns 400', async () => {
    const res = await request(app)
      .post('/api/admin/')
      .send({ /* no parkingConfig */ });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body).toHaveProperty('error', 'Missing parkingConfig');
  });

  it('POST /api/admin/ - creates new parking config', async () => {
    
    const res = await request(app)
      .post('/api/admin/')
      .send({
        parkingConfig: {
          facilityName: 'New Test Parking',
          totalSpots: 75,
          surfaceSpotIds: ['TEST_spot_new1', 'TEST_spot_new2'],
          avgRetrievalTimeMinutes: 35,
          maxQueueSize: 15,
          operatingHours: { 
            Sunday: { isActive: true, openingHour: '07:00', closingHour: '19:00' },
            Monday: { isActive: true, openingHour: '07:00', closingHour: '19:00' },
            Tuesday: { isActive: false, openingHour: '00:00', closingHour: '00:00' },
            Wednesday: { isActive: false, openingHour: '00:00', closingHour: '00:00' },
            Thursday: { isActive: false, openingHour: '00:00', closingHour: '00:00' },
            Friday: { isActive: false, openingHour: '00:00', closingHour: '00:00' },
            Saturday: { isActive: false, openingHour: '00:00', closingHour: '00:00' }
          },
          timezone: 'Asia/Jerusalem',
          updatedAt: new Date(),
          updatedBy: 'test-admin'
        }
      });
    expect(res.status).toBe(200); 
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('id');

    // Verify the record was created
    const createdRecord = await ParkingConfiguration.findByPk(res.body.id);
    expect(createdRecord).not.toBeNull();
    expect(createdRecord!.facilityName).toBe('New Test Parking');

    // Clean up the created record
    await ParkingConfiguration.destroy({ where: { id: res.body.id } });
  });

  // it('POST /api/admin/ - Lot ID already exists', async () => {
  //   const res = await request(app)
  //     .post('/api/admin/')
  //     .send({
  //       parkingConfig: {
  //         facilityName: 'Duplicate Test Parking',
  //         totalSpots: 50,
  //         surfaceSpotIds: ['spot1', 'spot2'],
  //         avgRetrievalTimeMinutes: 30,
  //         maxQueueSize: 10,
  //         operatingHours: { monday: '08:00-18:00' },
  //         timezone: 'UTC',
  //         updatedBy: 'test-admin'
  //       }
  //     });
  //   expect(res.status).toBe(409); // Changed to 409 based on actual API response
  //   expect(res.body).toHaveProperty('success', false);
  //   expect(res.body).toHaveProperty('error', 'Lot ID already exists');
  // });

  it('POST /api/admin/ - Database error during create', async () => {
    // Temporarily break the database connection to simulate error
    const originalCreate = ParkingConfiguration.create;
    ParkingConfiguration.create = jest.fn().mockRejectedValue(new Error('Database error'));
    
    const res = await request(app)
      .post('/api/admin/')
      .send({
        parkingConfig: {
          facilityName: 'Error Test Parking',
          totalSpots: 25,
          surfaceSpotIds: ['error_spot1'],
          avgRetrievalTimeMinutes: 20,
          maxQueueSize: 5,
          operatingHours: { 
            Sunday: { isActive: true, openingHour: '08:00', closingHour: '17:00' },
            Monday: { isActive: false, openingHour: '00:00', closingHour: '00:00' },
            Tuesday: { isActive: false, openingHour: '00:00', closingHour: '00:00' },
            Wednesday: { isActive: false, openingHour: '00:00', closingHour: '00:00' },
            Thursday: { isActive: false, openingHour: '00:00', closingHour: '00:00' },
            Friday: { isActive: false, openingHour: '00:00', closingHour: '00:00' },
            Saturday: { isActive: false, openingHour: '00:00', closingHour: '00:00' }
          },
          timezone: 'Asia/Jerusalem',
          updatedAt: new Date(),
          updatedBy: 'test-admin'
        }
      });
    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body).toHaveProperty('error', 'Internal server error');

    // Restore original function
    ParkingConfiguration.create = originalCreate;
  });

  it('POST /api/admin/ - creates config with only required fields', async () => {
    const currentDate = new Date().toISOString();
    const requiredFieldsOnlyConfig = {
      facilityName: 'Minimal Test Parking',
      totalSpots: 60,
      surfaceSpotIds: ['TEST_spot_minimal'],
      avgRetrievalTimeMinutes: 25,
      maxQueueSize: 8,
      timezone: 'Asia/Jerusalem',
      operatingHours: {
        Sunday: { isActive: true, openingHour: '08:00', closingHour: '17:00' },
        Monday: { isActive: false, openingHour: '00:00', closingHour: '00:00' },
        Tuesday: { isActive: false, openingHour: '00:00', closingHour: '00:00' },
        Wednesday: { isActive: false, openingHour: '00:00', closingHour: '00:00' },
        Thursday: { isActive: false, openingHour: '00:00', closingHour: '00:00' },
        Friday: { isActive: false, openingHour: '00:00', closingHour: '00:00' },
        Saturday: { isActive: false, openingHour: '00:00', closingHour: '00:00' }
      },
      updatedAt: currentDate,
      updatedBy: 'test-admin'
      // Note: Optional fields like maxParallelRetrievals, maintenanceMode, showAdminAnalytics not provided
    };

    console.log('Testing required fields only config:', JSON.stringify(requiredFieldsOnlyConfig, null, 2));
    
    const res = await request(app)
      .post('/api/admin/')
      .send({
        parkingConfig: requiredFieldsOnlyConfig
      });

    console.log('Response status:', res.status);
    console.log('Response body:', res.body);
    
    expect(res.status).toBe(200);
    if (res.status !== 200) {
      console.log('Response body:', res.body);
    }
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('id');

    // Verify the record was created
    const createdRecord = await ParkingConfiguration.findByPk(res.body.id);
    expect(createdRecord).not.toBeNull();
    expect(createdRecord!.facilityName).toBe('Minimal Test Parking');

    // Clean up the created record
    await ParkingConfiguration.destroy({ where: { id: res.body.id } });
  });

  // PUT Tests  
  it('PUT /api/admin/:id - missing parkingConfig returns 400', async () => {
    const res = await request(app)
      .put('/api/admin/1')
      .send({}); // No parkingConfig in body
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body).toHaveProperty('error', 'Missing parkingConfig');
  });

  it('PUT /api/admin/:id - not found returns 404', async () => {
    const res = await request(app)
      .put('/api/admin/99999') // Use numeric ID
      .send({
        parkingConfig: {
          facilityName: 'Updated Facility',
          totalSpots: 80,
          surfaceSpotIds: ['spot1', 'spot2'],
          avgRetrievalTimeMinutes: 25,
          maxQueueSize: 8,
          operatingHours: { 
            Sunday: { isActive: true, openingHour: '09:00', closingHour: '17:00' },
            Monday: { isActive: false, openingHour: '00:00', closingHour: '00:00' },
            Tuesday: { isActive: false, openingHour: '00:00', closingHour: '00:00' },
            Wednesday: { isActive: false, openingHour: '00:00', closingHour: '00:00' },
            Thursday: { isActive: false, openingHour: '00:00', closingHour: '00:00' },
            Friday: { isActive: false, openingHour: '00:00', closingHour: '00:00' },
            Saturday: { isActive: false, openingHour: '00:00', closingHour: '00:00' }
          },
          timezone: 'Asia/Jerusalem',
          updatedAt: new Date(),
          updatedBy: 'test-admin'
        }
      });
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body).toHaveProperty('error', 'ID not found');
  });

  it('PUT /api/admin/:id - successfully updates parking config', async () => {
    // First get a valid test config ID
    const allConfigs = await ParkingConfiguration.findAll();
    const testConfig = allConfigs.find(config => config.facilityName === 'Test Parking Facility 1');
    
    if (!testConfig) {
      throw new Error('Test config not found');
    }

    const updatedData = {
      facilityName: 'Updated Test Parking Facility 1',
      totalSpots: 120,
      surfaceSpotIds: ['TEST_spot1', 'TEST_spot2', 'TEST_spot3', 'TEST_spot4'],
      avgRetrievalTimeMinutes: 35,
      maxQueueSize: 12,
      operatingHours: { 
        Sunday: { isActive: true, openingHour: '07:00', closingHour: '19:00' },
        Monday: { isActive: true, openingHour: '07:00', closingHour: '19:00' },
        Tuesday: { isActive: true, openingHour: '07:00', closingHour: '19:00' },
        Wednesday: { isActive: true, openingHour: '07:00', closingHour: '19:00' },
        Thursday: { isActive: true, openingHour: '07:00', closingHour: '19:00' },
        Friday: { isActive: true, openingHour: '07:00', closingHour: '19:00' },
        Saturday: { isActive: false, openingHour: '00:00', closingHour: '00:00' }
      },
      timezone: 'Asia/Jerusalem',
      updatedAt: new Date().toISOString(),
      updatedBy: 'test-admin'
    };

    const res = await request(app)
      .put(`/api/admin/${testConfig.id}`)
      .send({ parkingConfig: updatedData });
    
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);

    // Verify the record was updated by fetching it again
    const updatedRecord = await ParkingConfiguration.findByPk(testConfig.id);
    expect(updatedRecord).not.toBeNull();
    expect(updatedRecord!.facilityName).toBe('Updated Test Parking Facility 1');
    expect(updatedRecord!.totalSpots).toBe(120);
  });

  it('PUT /api/admin/:id - Database error during update', async () => {
    // Get a valid test config first
    const allConfigs = await ParkingConfiguration.findAll();
    const testConfig = allConfigs.find(config => config.facilityName.startsWith('Test'));
    
    if (!testConfig) {
      throw new Error('Test config not found');
    }
    
    // Mock the update method to throw an error
    const originalUpdate = testConfig.update;
    testConfig.update = jest.fn().mockRejectedValue(new Error('Database error'));

    // Temporarily replace findByPk to return our mocked record
    const originalFindByPk = ParkingConfiguration.findByPk;
    ParkingConfiguration.findByPk = jest.fn().mockResolvedValue(testConfig);

    const res = await request(app)
      .put(`/api/admin/${testConfig.id}`)
      .send({
        parkingConfig: {
          facilityName: 'Error Update',
          totalSpots: 30,
          surfaceSpotIds: ['error_spot'],
          avgRetrievalTimeMinutes: 20,
          maxQueueSize: 5,
          operatingHours: { 
            Sunday: { isActive: true, openingHour: '08:00', closingHour: '17:00' },
            Monday: { isActive: false, openingHour: '00:00', closingHour: '00:00' },
            Tuesday: { isActive: false, openingHour: '00:00', closingHour: '00:00' },
            Wednesday: { isActive: false, openingHour: '00:00', closingHour: '00:00' },
            Thursday: { isActive: false, openingHour: '00:00', closingHour: '00:00' },
            Friday: { isActive: false, openingHour: '00:00', closingHour: '00:00' },
            Saturday: { isActive: false, openingHour: '00:00', closingHour: '00:00' }
          },
          timezone: 'Asia/Jerusalem',
          updatedAt: new Date(),
          updatedBy: 'test-admin'
        }
      });
    
    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body).toHaveProperty('error', 'Internal server error');

    // Restore original functions
    testConfig.update = originalUpdate;
    ParkingConfiguration.findByPk = originalFindByPk;
  });

  it('PUT /api/admin/:id - updates parking config without optional fields', async () => {
    // Get a valid test config first
    const allConfigs = await ParkingConfiguration.findAll();
    const testConfig = allConfigs.find(config => config.facilityName.startsWith('Test'));
    
    if (!testConfig) {
      throw new Error('Test config not found');
    }

    const updatedData = {
      facilityName: 'Updated Without Optional Fields',
      totalSpots: 90,
      surfaceSpotIds: ['TEST_spot_updated'],
      avgRetrievalTimeMinutes: 28,
      maxQueueSize: 9,
      operatingHours: { 
        Sunday: { isActive: true, openingHour: '08:00', closingHour: '17:00' },
        Monday: { isActive: false, openingHour: '00:00', closingHour: '00:00' },
        Tuesday: { isActive: false, openingHour: '00:00', closingHour: '00:00' },
        Wednesday: { isActive: false, openingHour: '00:00', closingHour: '00:00' },
        Thursday: { isActive: false, openingHour: '00:00', closingHour: '00:00' },
        Friday: { isActive: false, openingHour: '00:00', closingHour: '00:00' },
        Saturday: { isActive: false, openingHour: '00:00', closingHour: '00:00' }
      },
      timezone: 'Asia/Jerusalem',
      updatedAt: new Date().toISOString(),
      updatedBy: 'test-admin'
      // Note: optional fields not provided
    };

    const res = await request(app)
      .put(`/api/admin/${testConfig.id}`)
      .send({ parkingConfig: updatedData });
    
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);

    // Verify the record was updated
    const updatedRecord = await ParkingConfiguration.findByPk(testConfig.id);
    expect(updatedRecord).not.toBeNull();
    expect(updatedRecord!.facilityName).toBe('Updated Without Optional Fields');
  });

  // DELETE Tests
  it('DELETE /api/admin/:id - not found returns 404', async () => {
    const res = await request(app)
      .delete('/api/admin/99999'); // Use numeric ID
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body).toHaveProperty('error', 'Lot ID not found'); // This matches the actual error message from adminConfig.ts
  });

  it('DELETE /api/admin/:id - successfully deletes parking config', async () => {
    // First create a record to delete
    const recordToDelete = await ParkingConfiguration.create({
      facilityName: 'To Be Deleted',
      totalSpots: 10,
      surfaceSpotIds: ['delete_spot1'],
      avgRetrievalTimeMinutes: 15,
      maxQueueSize: 3,
      operatingHours: { 
        Sunday: { isActive: true, openingHour: '08:00', closingHour: '17:00' },
        Monday: { isActive: false, openingHour: '00:00', closingHour: '00:00' },
        Tuesday: { isActive: false, openingHour: '00:00', closingHour: '00:00' },
        Wednesday: { isActive: false, openingHour: '00:00', closingHour: '00:00' },
        Thursday: { isActive: false, openingHour: '00:00', closingHour: '00:00' },
        Friday: { isActive: false, openingHour: '00:00', closingHour: '00:00' },
        Saturday: { isActive: false, openingHour: '00:00', closingHour: '00:00' }
      },
      timezone: 'Asia/Jerusalem',
      updatedAt: new Date(),
      updatedBy: 'test-admin'
    });

    const res = await request(app)
      .delete(`/api/admin/${recordToDelete.id}`);
    
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);

    // Verify the record was actually deleted
    const deletedRecord = await ParkingConfiguration.findByPk(recordToDelete.id);
    expect(deletedRecord).toBeNull();
  });

  it('DELETE /api/admin/:id - Database error during delete', async () => {
    // Create a record specifically for this test
    const testRecord = await ParkingConfiguration.create({
      facilityName: 'Test Delete Error',
      totalSpots: 10,
      surfaceSpotIds: ['delete_error_spot1'],
      avgRetrievalTimeMinutes: 15,
      maxQueueSize: 3,
      operatingHours: { 
        Sunday: { isActive: true, openingHour: '08:00', closingHour: '17:00' },
        Monday: { isActive: false, openingHour: '00:00', closingHour: '00:00' },
        Tuesday: { isActive: false, openingHour: '00:00', closingHour: '00:00' },
        Wednesday: { isActive: false, openingHour: '00:00', closingHour: '00:00' },
        Thursday: { isActive: false, openingHour: '00:00', closingHour: '00:00' },
        Friday: { isActive: false, openingHour: '00:00', closingHour: '00:00' },
        Saturday: { isActive: false, openingHour: '00:00', closingHour: '00:00' }
      },
      timezone: 'Asia/Jerusalem',
      updatedBy: 'test-admin'
    });

    // Mock the destroy method to throw an error
    const originalDestroy = testRecord.destroy;
    testRecord.destroy = jest.fn().mockRejectedValue(new Error('Database error'));

    // Temporarily replace findByPk to return our mocked record
    const originalFindByPk = ParkingConfiguration.findByPk;
    ParkingConfiguration.findByPk = jest.fn().mockResolvedValue(testRecord);

    const res = await request(app)
      .delete(`/api/admin/${testRecord.id}`);
    
    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body).toHaveProperty('error', 'Internal server error');

    // Restore original functions
    testRecord.destroy = originalDestroy;
    ParkingConfiguration.findByPk = originalFindByPk;
  });

  // Additional tests for 100% code coverage
  it('POST /api/admin/ - validation fails', async () => {
    const invalidConfig = {
      facilityName: '', // Invalid - empty string
      totalSpots: -5, // Invalid - negative number
    };

    const res = await request(app)
      .post('/api/admin/')
      .send({ parkingConfig: invalidConfig });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body.error).toContain('Validation failed');
  });

  it('PUT /api/admin/:id - validation fails', async () => {
    // Get a valid test config first
    const allConfigs = await ParkingConfiguration.findAll();
    const testConfig = allConfigs.find(config => config.facilityName.startsWith('Test'));
    
    if (!testConfig) {
      throw new Error('Test config not found');
    }

    const invalidUpdateData = {
      facilityName: '', // Invalid - empty string
      totalSpots: -10, // Invalid - negative number
    };

    const res = await request(app)
      .put(`/api/admin/${testConfig.id}`)
      .send({ parkingConfig: invalidUpdateData });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body.error).toContain('Validation failed');
  });

  it('PUT /api/admin/:id - ID not found', async () => {
    const nonExistentId = 999999;
    const validUpdateData = {
      facilityName: 'Updated Facility Name',
      totalSpots: 80,
      surfaceSpotIds: ['spot1', 'spot2'],
      avgRetrievalTimeMinutes: 25,
      maxQueueSize: 8,
      operatingHours: { 
        Sunday: { isActive: true, openingHour: '09:00', closingHour: '17:00' },
        Monday: { isActive: false, openingHour: '00:00', closingHour: '00:00' },
        Tuesday: { isActive: false, openingHour: '00:00', closingHour: '00:00' },
        Wednesday: { isActive: false, openingHour: '00:00', closingHour: '00:00' },
        Thursday: { isActive: false, openingHour: '00:00', closingHour: '00:00' },
        Friday: { isActive: false, openingHour: '00:00', closingHour: '00:00' },
        Saturday: { isActive: false, openingHour: '00:00', closingHour: '00:00' }
      },
      timezone: 'Asia/Jerusalem',
      updatedAt: new Date().toISOString(),
      updatedBy: 'test-admin'
    };

    const res = await request(app)
      .put(`/api/admin/${nonExistentId}`)
      .send({ parkingConfig: validUpdateData });

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body.error).toBe('ID not found');
  });
});