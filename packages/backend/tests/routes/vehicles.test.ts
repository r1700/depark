import request from 'supertest';
import express from 'express';
import APIvehicle from '../../src/routes/APIvehicle';

jest.mock('../../src/db/connection', () => ({
  query: jest.fn(),
}));

import db from '../../src/db/connection';
const mockQuery = db.query as jest.Mock;

const app = express();
app.use(express.json());
app.use('/api/vehicles', APIvehicle);

describe('GET /api/vehicles', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Returns 200 with data if exists', async () => {
    const mockRows = [{ id: 1, license_plate: '1234' }];
    mockQuery.mockResolvedValueOnce({ rows: mockRows });

    const res = await request(app).get('/api/vehicles');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.vehicles).toEqual(mockRows);
    expect(res.body.filters).toEqual({});
  });

  test('Returns 200 with empty array if no data', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [] });

    const res = await request(app).get('/api/vehicles');

    expect(res.status).toBe(200);
    expect(res.body.vehicles).toEqual([]);
  });

  test('Filters by search', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [] });

    await request(app).get('/api/vehicles').query({ search: 'test' });

    expect(mockQuery).toHaveBeenCalledTimes(1);
    const [query, values] = mockQuery.mock.calls[0];
    expect(query).toMatch(/ILIKE/);
    expect(values[0]).toBe('%test%');
  });

  test('Filters by valid is_active', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [] });

    await request(app).get('/api/vehicles').query({ is_active: 'true' });

    const [query, values] = mockQuery.mock.calls[0];
    expect(query).toMatch(/v.is_active/);
    expect(values).toContain(true);
  });

  test('Does not add condition if is_active is invalid', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [] });

    const res = await request(app)
      .get('/api/vehicles')
      .query({ is_active: 'maybe' });

    expect(res.status).toBe(200);
    expect(res.body.filters).toEqual({ is_active: 'maybe' });
  });

  test('Filters by valid is_currently_parked', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [] });

    await request(app)
      .get('/api/vehicles')
      .query({ is_currently_parked: 'false' });

    const [query, values] = mockQuery.mock.calls[0];
    expect(query).toMatch(/v.is_currently_parked/);
    expect(values).toContain(false);
  });

  test('Filters by created_at', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [] });

    await request(app)
      .get('/api/vehicles')
      .query({ created_at: '2025-01-01' });

    const [query, values] = mockQuery.mock.calls[0];
    expect(query).toMatch(/DATE\(v\.created_at\)/);
    expect(values).toContain('2025-01-01');
  });

  test('Filters by updated_at', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [] });

    await request(app)
      .get('/api/vehicles')
      .query({ updated_at: '2025-01-02' });

    const [query, values] = mockQuery.mock.calls[0];
    expect(query).toMatch(/DATE\(v\.updated_at\)/);
    expect(values).toContain('2025-01-02');
  });

  test('Returns 500 on DB error', async () => {
    mockQuery.mockRejectedValueOnce(new Error('DB failed'));

    const res = await request(app).get('/api/vehicles');

    expect(res.status).toBe(500);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBe('DB failed');
  });
});
