jest.mock('../../src/db/connection', () => ({
  __esModule: true,
  default: {
    query: jest.fn(),
    end: jest.fn(),
  },
}));

import request from 'supertest';
import express from 'express';
import router from '../../src/routes/APIvehicle';
import client from '../../src/db/connection';

const app = express();
app.use(express.json());
app.use('/api/vehicles', router);

const mockQuery = (client.query as unknown) as jest.Mock;

beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(() => {
  (console.error as jest.Mock).mockRestore();
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe('services/APIvehicle - getAllVehicles (unit)', () => {
  it('getAllVehicles should return rows from DB', async () => {
    const realService = jest.requireActual('../../src/services/APIvehicle') as typeof import('../../src/services/APIvehicle');
    const fakeRows = [{ id: 1, license_plate: 'AAA111' }];
    mockQuery.mockResolvedValueOnce({ rows: fakeRows });

    const result = await realService.getAllVehicles();

    expect(result).toEqual(fakeRows);
    expect(mockQuery).toHaveBeenCalledTimes(1);
    expect(mockQuery).toHaveBeenCalledWith('SELECT * FROM vehicles WHERE 1=1', []);
  });

  it('getAllVehicles should propagate DB error (reject)', async () => {
    const realService = jest.requireActual('../../src/services/APIvehicle') as typeof import('../../src/services/APIvehicle');
    mockQuery.mockRejectedValueOnce(new Error('DB failure'));

    await expect(realService.getAllVehicles()).rejects.toThrow('DB failure');
    expect(mockQuery).toHaveBeenCalledTimes(1);
  });
});

describe('services/APIvehicle - getAllVehicles filters (unit)', () => {
  const realService = jest.requireActual('../../src/services/APIvehicle') as typeof import('../../src/services/APIvehicle');

  it('should apply search filter', async () => {
    const fakeRows = [{ id: 2, license_plate: 'SEARCH' }];
    mockQuery.mockResolvedValueOnce({ rows: fakeRows });

    const result = await realService.getAllVehicles({ search: 'sea' });

    expect(result).toEqual(fakeRows);
    expect(mockQuery).toHaveBeenCalledTimes(1);
    const [query, values] = mockQuery.mock.calls[0];
    expect(query).toMatch(/^SELECT \* FROM vehicles WHERE 1=1/);
    expect(query).toMatch(/license_plate ILIKE/);
    expect(values).toEqual(['%sea%']);
  });

  it('should apply boolean filters is_active and is_currently_parked', async () => {
    const fakeRows = [{ id: 3, license_plate: 'BOOL' }];
    mockQuery.mockResolvedValueOnce({ rows: fakeRows });

    const result = await realService.getAllVehicles({ is_active: true, is_currently_parked: false });

    expect(result).toEqual(fakeRows);
    expect(mockQuery).toHaveBeenCalledTimes(1);
    const [, values] = mockQuery.mock.calls[0];
    expect(values).toEqual([true, false]);
  });

  it('should apply date filters created_at and updated_at', async () => {
    const fakeRows = [{ id: 4, license_plate: 'DATE' }];
    mockQuery.mockResolvedValueOnce({ rows: fakeRows });

    const filters = { created_at: '2023-07-01', updated_at: '2023-07-02' };
    await realService.getAllVehicles(filters);

    expect(mockQuery).toHaveBeenCalledTimes(1);
    const [query, values] = mockQuery.mock.calls[0];
    expect(query).toMatch(/DATE\(created_at\) =/);
    expect(query).toMatch(/DATE\(updated_at\) =/);
    expect(values).toEqual([filters.created_at, filters.updated_at]);
  });

  it('should apply combination of all filters and maintain params order', async () => {
    const fakeRows = [{ id: 5 }];
    mockQuery.mockResolvedValueOnce({ rows: fakeRows });

    const filters = {
      search: 'x',
      is_active: false,
      is_currently_parked: true,
      created_at: '2023-07-01',
      updated_at: '2023-07-02',
    };

    await realService.getAllVehicles(filters);

    expect(mockQuery).toHaveBeenCalledTimes(1);
    const [query, values] = mockQuery.mock.calls[0];
    expect(query).toMatch(/license_plate ILIKE/);
    expect(query).toMatch(/is_active =/);
    expect(query).toMatch(/is_currently_parked =/);
    expect(query).toMatch(/DATE\(created_at\) =/);
    expect(query).toMatch(/DATE\(updated_at\) =/);
    expect(values.length).toBe(5);
    expect(values[0]).toBe(`%${filters.search}%`);
  });

  it('should throw generic error when client.query rejects with non-Error', async () => {
    mockQuery.mockRejectedValueOnce({});
    await expect(realService.getAllVehicles()).rejects.toThrow('Internal server error');
    expect(mockQuery).toHaveBeenCalledTimes(1);
  });
});

describe('GET /api/vehicles/ (getAllVehicles route)', () => {
  it('should return 200 and vehicles when DB resolves', async () => {
    const fake = [{ id: 10, license_plate: 'ZZZ999' }];
    mockQuery.mockResolvedValueOnce({ rows: fake });

    const res = await request(app).get('/api/vehicles/');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.vehicles).toEqual(fake);
    expect(mockQuery).toHaveBeenCalledTimes(1);
  });

  it('should return 500 and error message when DB throws', async () => {
    mockQuery.mockRejectedValueOnce(new Error('service failed'));

    const res = await request(app).get('/api/vehicles/');

    expect(res.status).toBe(500);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBe('service failed');
    expect(mockQuery).toHaveBeenCalledTimes(1);
  });

  it('should return 500 and generic message when DB throws non-Error (no message)', async () => {
    mockQuery.mockRejectedValueOnce({});
    const res = await request(app).get('/api/vehicles/');

    expect(res.status).toBe(500);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBe('Internal server error');
    expect(mockQuery).toHaveBeenCalledTimes(1);
  });
});

describe('GET /api/vehicles/filterVehicles', () => {
  it('should return vehicles when data found', async () => {
    const fakeVehicles = [
      {
        id: 1,
        license_plate: 'ABC123',
        is_active: true,
        is_currently_parked: false,
        created_at: '2023-07-01',
        updated_at: '2023-07-02',
        baseuser_name: 'John Doe',
        email: 'john@example.com',
        phone: '123456789',
      },
    ];

    mockQuery.mockResolvedValueOnce({ rows: fakeVehicles });

    const res = await request(app)
      .get('/api/vehicles/filterVehicles')
      .query({ search: 'john' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.vehicles).toEqual(fakeVehicles);
    expect(mockQuery).toHaveBeenCalledTimes(1);
  });

  it('should handle request with no filters (default case)', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [{ id: 1, license_plate: 'DEF456' }] });

    const res = await request(app).get('/api/vehicles/filterVehicles');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.vehicles).toEqual([{ id: 1, license_plate: 'DEF456' }]);
    expect(mockQuery).toHaveBeenCalledTimes(1);
  });

  it('should return 404 when no vehicles found', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [] });

    const res = await request(app).get('/api/vehicles/filterVehicles');

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBe('No vehicles found with the specified filters');
    expect(mockQuery).toHaveBeenCalledTimes(1);
  });

  it('should ignore invalid is_active param and return results', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [{ id: 1, license_plate: 'Z123' }] });

    const res = await request(app)
      .get('/api/vehicles/filterVehicles')
      .query({ is_active: 'maybe' });

    expect(res.status).toBe(200);
    expect(mockQuery).toHaveBeenCalledTimes(1);
  });

  it('should return 500 on DB error', async () => {
    mockQuery.mockRejectedValueOnce(new Error('DB failed'));

    const res = await request(app).get('/api/vehicles/filterVehicles');

    expect(res.status).toBe(500);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBe('DB failed');
    expect(mockQuery).toHaveBeenCalledTimes(1);
  });

  it('should return 500 and generic message when db error has no message', async () => {
    mockQuery.mockRejectedValueOnce({});
    const res = await request(app).get('/api/vehicles/filterVehicles');

    expect(res.status).toBe(500);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBe('Internal server error');
    expect(mockQuery).toHaveBeenCalledTimes(1);
  });

  it('should build query with correct clauses', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [{ id: 1, license_plate: 'X123' }] });

    const filters = {
      search: 'doe',
      is_active: 'true',
      is_currently_parked: 'false',
      created_at: '2023-07-01',
      updated_at: '2023-07-02',
    };

    await request(app).get('/api/vehicles/filterVehicles').query(filters);

    expect(mockQuery).toHaveBeenCalledTimes(1);
    const [queryString, values] = mockQuery.mock.calls[0];

    expect(queryString).toMatch(/CONCAT\(bu\.first_name, ' ', bu\.last_name\) ILIKE/);
    expect(queryString).toMatch(/v\.is_active =/);
    expect(queryString).toMatch(/v\.is_currently_parked =/);
    expect(values.length).toBeGreaterThanOrEqual(4);
  });
});