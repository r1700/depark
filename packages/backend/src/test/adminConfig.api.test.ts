import request from 'supertest';
import express from 'express';

// Mock Sequelize model BEFORE importing adminConfig
const mockParkingConfiguration = {
  findByPk: jest.fn(),
  findAll: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
};

// Mock the entire ParkingConfiguration model
jest.mock('../models/ParkingConfiguration', () => mockParkingConfiguration);

// Now import adminConfigRouter after the mock is set up
import adminConfigRouter from '../routes/adminConfig';

describe('adminConfig API', () => {
  const app = express();
  app.use(express.json());
  app.use('/api/admin', adminConfigRouter);

  // Mock console.error to suppress error logs during testing
  const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

  beforeEach(() => {
    jest.clearAllMocks();
  });
  afterEach(() => {
    jest.resetAllMocks();
  });

  afterAll(() => {
    consoleSpy.mockRestore();
  });

  it('GET /api/admin/ - should return all parking configs', async () => {
    mockParkingConfiguration.findAll.mockResolvedValue([
      { id: 'test-1', facilityName: 'Test Parking' }
    ]);

    const res = await request(app).get('/api/admin/');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('parkingConfigs');
    expect(Array.isArray(res.body.parkingConfigs)).toBe(true);
  });
  it('GET /api/admin/ - error during retrieval returns 500', async () => {
    mockParkingConfiguration.findAll.mockRejectedValue(new Error('Database connection error'));

    const res = await request(app)
      .get('/api/admin/');
    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body).toHaveProperty('error', 'Internal server error');
  });

  it('GET /api/admin/:id - not found returns 404', async () => {
    mockParkingConfiguration.findByPk.mockResolvedValue(null);

    const res = await request(app).get('/api/admin/nonexistent-id');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body).toHaveProperty('error', 'Lot ID not found');
  });

  it('GET /api/admin/:id - ID exists returns 200', async () => {
    mockParkingConfiguration.findByPk.mockResolvedValue({
      id: 'existing-id', 
      facilityName: 'Found Parking'
    });

    const res = await request(app).get('/api/admin/existing-id');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('parkingConfig');
    expect(res.body.parkingConfig).toHaveProperty('id', 'existing-id');
  });

  it('GET /api/admin/:id - error during retrieval returns 500', async () => {
    mockParkingConfiguration.findByPk.mockRejectedValue(new Error('Database connection error'));
    
    const res = await request(app)
      .get('/api/admin/database-error-id');
    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body).toHaveProperty('error', 'Internal server error');
  });
  it('POST /api/admin/ - missing lotId returns 400', async () => {
    const res = await request(app)
      .post('/api/admin/')
      .send({ parkingConfig: { facilityName: 'Test' } });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body).toHaveProperty('error', 'Missing parkingConfig or lotId');
  });
  it('POST /api/admin/ - creates new parking config', async () => {
    // Mock for checking if lotId exists (should return null)
    mockParkingConfiguration.findByPk.mockResolvedValue(null);
    // Mock for CREATE operation
    mockParkingConfiguration.create.mockResolvedValue({
      id: 'new-parking-lot',
      facilityName: 'New Parking'
    });

    const res = await request(app)
      .post('/api/admin/')
      .send({
        parkingConfig: {
          lotId: 'new-parking-lot',
          facilityName: 'New Parking',
          totalSurfaceSpots: 100,
          surfaceSpotIds: ['spot1', 'spot2'],
          avgRetrievalTimeMinutes: 30,
          maxQueueSize: 10,
          operatingHours: { monday: '08:00-18:00' },
          timezone: 'UTC',
          createdBy: 'admin'
        }
      });
    expect(res.status).toBe(200); 
    expect(res.body).toHaveProperty('success', true);
  });

  it('POST /api/admin/ - Lot ID already exists', async () => {
    mockParkingConfiguration.findByPk.mockResolvedValue({
      id: 'existing-id',
      facilityName: 'Existing Parking'
    });

    const res = await request(app)
      .post('/api/admin/')
      .send({
        parkingConfig: {
          lotId: 'existing-id', 
          facilityName: 'Test Parking'
        }
      });
    expect(res.status).toBe(409);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body).toHaveProperty('error', 'Lot ID already exists');
  });

  it('POST /api/admin Error saving parking config', async () => {
    mockParkingConfiguration.findByPk.mockResolvedValue(null);
    mockParkingConfiguration.create.mockRejectedValue(new Error('Database error'));
    
    const res = await request(app)
      .post('/api/admin/')
      .send({
        parkingConfig: {
          lotId: 'error-lot',
          facilityName: 'Error Parking'
        }
      });
    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body).toHaveProperty('error', 'Internal server error');
  });

  it('PUT /api/admin/:id - missing parkingConfig returns 400', async () => {
    const res = await request(app)
      .put('/api/admin/some-id')
      .send({});
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body).toHaveProperty('error', 'Missing parkingConfig');
  });

  it('PUT /api/admin/:id - not found returns 404', async () => {
    mockParkingConfiguration.findByPk.mockResolvedValue(null);

    const res = await request(app)
      .put('/api/admin/nonexistent-id')
      .send({
        parkingConfig: {
          facilityName: 'Updated Parking',
          totalSurfaceSpots: 50
        }
      });
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body).toHaveProperty('error', 'Lot ID not found');
  });

  it('PUT /api/admin/:id - successfully updates parking config', async () => {
    const mockInstance = {
      update: jest.fn().mockResolvedValue({})
    };
    mockParkingConfiguration.findByPk.mockResolvedValue(mockInstance);

    const res = await request(app)
      .put('/api/admin/existing-id')
      .send({
        parkingConfig: {
          facilityName: 'Updated Parking',
          totalSurfaceSpots: 50,
          surfaceSpotIds: ['updated1', 'updated2'],
          avgRetrievalTimeMinutes: 25,
          maxQueueSize: 15,
          operatingHours: { monday: '09:00-19:00' },
          timezone: 'UTC',
          updatedBy: 'admin'
        }
      });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(mockInstance.update).toHaveBeenCalled();
  });
  
  it('PUT /api/admin/:id - error during update returns 500', async () => {
    const mockInstance = {
      update: jest.fn().mockRejectedValue(new Error('Database update error'))
    };
    mockParkingConfiguration.findByPk.mockResolvedValue(mockInstance);
    
    const res = await request(app)
      .put('/api/admin/maintenance')
      .send({
        parkingConfig: {
          facilityName: 'Error Parking',
          totalSurfaceSpots: 50
        }
      });
    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body).toHaveProperty('error', 'Internal server error');
  });
});