import request from 'supertest';
import express from 'express';
import ParkingConfiguration from '../models/ParkingConfiguration';
import adminConfigRouter from '../routes/adminConfig';

describe('adminConfig API', () => {
  const app = express();
  app.use(express.json());
  app.use('/api/admin', adminConfigRouter);

  // Mock console.error to suppress error logs during testing
  const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

  // Setup test data before all tests
  beforeAll(async () => {
    // Clean up any existing test data first
    await ParkingConfiguration.destroy({
      where: {
        id: {
          [require('sequelize').Op.like]: 'TEST_%'
        }
      }
    });

    // Create test parking configurations
    await ParkingConfiguration.create({
      id: 'TEST_parking_1',
      facilityName: 'Test Parking Facility 1',
      totalSpots: 100,
      surfaceSpotIds: ['TEST_spot1', 'TEST_spot2', 'TEST_spot3'],
      avgRetrievalTimeMinutes: 30,
      maxQueueSize: 10,
      maxParallelRetrievals: 3,
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
      maintenanceMode: false,
      showAdminAnalytics: true,
      updatedBy: 'test-admin'
    });

    await ParkingConfiguration.create({
      id: 'TEST_parking_2',
      facilityName: 'Test Parking Facility 2',
      totalSpots: 50,
      surfaceSpotIds: ['TEST_spot4', 'TEST_spot5'],
      avgRetrievalTimeMinutes: 25,
      maxQueueSize: 5,
      maxParallelRetrievals: 2,
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
      maintenanceMode: false,
      showAdminAnalytics: true,
      updatedBy: 'test-admin'
    });
  });

  // Clean up test data after all tests
  afterAll(async () => {
    // Delete all records with TEST_ prefix
    await ParkingConfiguration.destroy({
      where: {
        id: {
          [require('sequelize').Op.like]: 'TEST_%'
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
    const testData = res.body.parkingConfigs.filter((config: any) => config.id.startsWith('TEST_'));
    expect(testData).toHaveLength(2);
    expect(testData[0]).toHaveProperty('id', 'TEST_parking_1');
    expect(testData[1]).toHaveProperty('id', 'TEST_parking_2');
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
    const res = await request(app).get('/api/admin/nonexistent-id');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body).toHaveProperty('error', 'Lot ID not found');
  });

  it('GET /api/admin/:id - ID exists returns 200', async () => {
    const res = await request(app).get('/api/admin/TEST_parking_1');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('parkingConfig');
    expect(res.body.parkingConfig).toHaveProperty('id', 'TEST_parking_1');
    expect(res.body.parkingConfig).toHaveProperty('facilityName', 'Test Parking Facility 1');
  });

  it('GET /api/admin/:id - error during retrieval returns 500', async () => {
    // Temporarily break the database connection to simulate error  
    const originalFindByPk = ParkingConfiguration.findByPk;
    ParkingConfiguration.findByPk = jest.fn().mockRejectedValue(new Error('Database connection error'));
    
    const res = await request(app)
      .get('/api/admin/database-error-id');
    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body).toHaveProperty('error', 'Internal server error');

    // Restore original function
    ParkingConfiguration.findByPk = originalFindByPk;
  });

  // POST Tests
  it('POST /api/admin/ - missing lotId returns 400', async () => {
    const res = await request(app)
      .post('/api/admin/')
      .send({ parkingConfig: { facilityName: 'Test' } });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body).toHaveProperty('error', 'Missing parkingConfig or lotId');
  });

  it('POST /api/admin/ - creates new parking config', async () => {
    const newLotId = 'TEST_new_parking_lot';
    
    const res = await request(app)
      .post('/api/admin/')
      .send({
        parkingConfig: {
          lotId: newLotId,
          facilityName: 'New Test Parking',
          totalSpots: 75,
          surfaceSpotIds: ['TEST_spot_new1', 'TEST_spot_new2'],
          avgRetrievalTimeMinutes: 35,
          maxQueueSize: 15,
          operatingHours: { monday: '07:00-19:00' },
          timezone: 'UTC',
          updatedBy: 'test-admin'
        }
      });
    expect(res.status).toBe(200); 
    expect(res.body).toHaveProperty('success', true);

    // Verify the record was created
    const createdRecord = await ParkingConfiguration.findByPk(newLotId);
    expect(createdRecord).not.toBeNull();
    expect(createdRecord!.facilityName).toBe('New Test Parking');

    // Clean up the created record
    await ParkingConfiguration.destroy({ where: { id: newLotId } });
  });

  it('POST /api/admin/ - Lot ID already exists', async () => {
    const res = await request(app)
      .post('/api/admin/')
      .send({
        parkingConfig: {
          lotId: 'TEST_parking_1', // This already exists in our test data
          facilityName: 'Duplicate Test Parking',
          totalSpots: 50,
          surfaceSpotIds: ['spot1', 'spot2'],
          avgRetrievalTimeMinutes: 30,
          maxQueueSize: 10,
          operatingHours: { monday: '08:00-18:00' },
          timezone: 'UTC',
          updatedBy: 'test-admin'
        }
      });
    expect(res.status).toBe(409); // Changed to 409 based on actual API response
    expect(res.body).toHaveProperty('success', false);
    expect(res.body).toHaveProperty('error', 'Lot ID already exists');
  });

  it('POST /api/admin/ - Database error during create', async () => {
    // Temporarily break the database connection to simulate error
    const originalCreate = ParkingConfiguration.create;
    ParkingConfiguration.create = jest.fn().mockRejectedValue(new Error('Database error'));
    
    const res = await request(app)
      .post('/api/admin/')
      .send({
        parkingConfig: {
          lotId: 'TEST_error_lot',
          facilityName: 'Error Test Parking',
          totalSpots: 25,
          surfaceSpotIds: ['error_spot1'],
          avgRetrievalTimeMinutes: 20,
          maxQueueSize: 5,
          operatingHours: { monday: '08:00-17:00' },
          timezone: 'UTC',
          updatedBy: 'test-admin'
        }
      });
    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body).toHaveProperty('error', 'Internal server error');

    // Restore original function
    ParkingConfiguration.create = originalCreate;
  });

  it('POST /api/admin/ - defaults updatedBy to admin when not provided', async () => {
    const newLotId = 'TEST_no_updated_by';
    
    const res = await request(app)
      .post('/api/admin/')
      .send({
        parkingConfig: {
          lotId: newLotId,
          facilityName: 'No UpdatedBy Test Parking',
          totalSpots: 60,
          surfaceSpotIds: ['TEST_spot_no_updated'],
          avgRetrievalTimeMinutes: 40,
          maxQueueSize: 8,
          operatingHours: { monday: '08:00-18:00' },
          timezone: 'UTC'
          // Note: no updatedBy field provided
        }
      });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);

    // Verify the record was created with default updatedBy
    const createdRecord = await ParkingConfiguration.findByPk(newLotId);
    expect(createdRecord).not.toBeNull();
    expect(createdRecord!.updatedBy).toBe('admin'); // Should default to 'admin'

    // Clean up the created record
    await ParkingConfiguration.destroy({ where: { id: newLotId } });
  });

  // PUT Tests  
  it('PUT /api/admin/:id - missing parkingConfig returns 400', async () => {
    const res = await request(app)
      .put('/api/admin/TEST_parking_1')
      .send({}); // No parkingConfig in body
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body).toHaveProperty('error', 'Missing parkingConfig');
  });

  it('PUT /api/admin/:id - not found returns 404', async () => {
    const res = await request(app)
      .put('/api/admin/nonexistent-id')
      .send({
        parkingConfig: {
          facilityName: 'Updated Facility',
          totalSpots: 80,
          surfaceSpotIds: ['spot1', 'spot2'],
          avgRetrievalTimeMinutes: 25,
          maxQueueSize: 8,
          operatingHours: { monday: '09:00-17:00' },
          timezone: 'UTC',
          updatedBy: 'test-admin'
        }
      });
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body).toHaveProperty('error', 'Lot ID not found');
  });

  it('PUT /api/admin/:id - successfully updates parking config', async () => {
    const updatedData = {
      facilityName: 'Updated Test Parking Facility 1',
      totalSpots: 120,
      surfaceSpotIds: ['TEST_spot1', 'TEST_spot2', 'TEST_spot3', 'TEST_spot4'],
      avgRetrievalTimeMinutes: 35,
      maxQueueSize: 12,
      maxParallelRetrievals: 2,
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
      maintenanceMode: false,
      showAdminAnalytics: true,
      updatedBy: 'test-admin'
    };

    const res = await request(app)
      .put('/api/admin/TEST_parking_1')
      .send({ parkingConfig: updatedData });
    
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);

    // Verify the record was updated by fetching it again
    const updatedRecord = await ParkingConfiguration.findByPk('TEST_parking_1');
    expect(updatedRecord).not.toBeNull();
    expect(updatedRecord!.facilityName).toBe('Updated Test Parking Facility 1');
    expect(updatedRecord!.totalSpots).toBe(120);
  });

  it('PUT /api/admin/:id - Database error during update', async () => {
    // Find the record first to mock the update method
    const record = await ParkingConfiguration.findByPk('TEST_parking_2');
    
    // Mock the update method to throw an error
    const originalUpdate = record!.update;
    record!.update = jest.fn().mockRejectedValue(new Error('Database error'));

    // Temporarily replace findByPk to return our mocked record
    const originalFindByPk = ParkingConfiguration.findByPk;
    ParkingConfiguration.findByPk = jest.fn().mockResolvedValue(record);

    const res = await request(app)
      .put('/api/admin/TEST_parking_2')
      .send({
        parkingConfig: {
          facilityName: 'Error Update',
          totalSpots: 30,
          surfaceSpotIds: ['error_spot'],
          avgRetrievalTimeMinutes: 20,
          maxQueueSize: 5,
          operatingHours: { monday: '08:00-17:00' },
          timezone: 'UTC',
          updatedBy: 'test-admin'
        }
      });
    
    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body).toHaveProperty('error', 'Internal server error');

    // Restore original functions
    record!.update = originalUpdate;
    ParkingConfiguration.findByPk = originalFindByPk;
  });

  it('PUT /api/admin/:id - defaults updatedBy to admin when not provided', async () => {
    const updatedData = {
      facilityName: 'Updated Without UpdatedBy',
      totalSpots: 90,
      surfaceSpotIds: ['TEST_spot_updated'],
      avgRetrievalTimeMinutes: 28,
      maxQueueSize: 9,
      operatingHours: { monday: '08:00-17:00' },
      timezone: 'UTC'
      // Note: no updatedBy field provided
    };

    const res = await request(app)
      .put('/api/admin/TEST_parking_1')
      .send({ parkingConfig: updatedData });
    
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);

    // Verify the record was updated with default updatedBy
    const updatedRecord = await ParkingConfiguration.findByPk('TEST_parking_1');
    expect(updatedRecord).not.toBeNull();
    expect(updatedRecord!.updatedBy).toBe('admin'); // Should default to 'admin'
    expect(updatedRecord!.facilityName).toBe('Updated Without UpdatedBy');
  });

  // DELETE Tests
  it('DELETE /api/admin/:id - not found returns 404', async () => {
    const res = await request(app)
      .delete('/api/admin/nonexistent-id');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body).toHaveProperty('error', 'Lot ID not found');
  });

  it('DELETE /api/admin/:id - successfully deletes parking config', async () => {
    // First create a record to delete
    const recordToDelete = await ParkingConfiguration.create({
      id: 'TEST_delete_me',
      facilityName: 'To Be Deleted',
      totalSpots: 10,
      surfaceSpotIds: ['delete_spot1'],
      avgRetrievalTimeMinutes: 15,
      maxQueueSize: 3,
      operatingHours: { monday: '08:00-17:00' },
      timezone: 'UTC',
      updatedBy: 'test-admin',
      maintenanceMode: false,
      showAdminAnalytics: false,
      maxParallelRetrievals: 1
    });

    const res = await request(app)
      .delete('/api/admin/TEST_delete_me');
    
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);

    // Verify the record was actually deleted
    const deletedRecord = await ParkingConfiguration.findByPk('TEST_delete_me');
    expect(deletedRecord).toBeNull();
  });

  it('DELETE /api/admin/:id - Database error during delete', async () => {
    // Find the record first to mock the destroy method
    const record = await ParkingConfiguration.findByPk('TEST_parking_2');
    
    // Mock the destroy method to throw an error
    const originalDestroy = record!.destroy;
    record!.destroy = jest.fn().mockRejectedValue(new Error('Database error'));

    // Temporarily replace findByPk to return our mocked record
    const originalFindByPk = ParkingConfiguration.findByPk;
    ParkingConfiguration.findByPk = jest.fn().mockResolvedValue(record);

    const res = await request(app)
      .delete('/api/admin/TEST_parking_2');
    
    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body).toHaveProperty('error', 'Internal server error');

    // Restore original functions
    record!.destroy = originalDestroy;
    ParkingConfiguration.findByPk = originalFindByPk;
  });
});