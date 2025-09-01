import request from 'supertest';
import express from 'express';
import logosRouter from '../../../backend/src/routes/logos';
import { Logo } from '../../../backend/src/model/database-models/logo.model';

const app = express();
app.use(express.json());
app.use('/api/logos', logosRouter);

describe('Logo API', () => {
  let logoId: number;
  const logoUrl = '/logos/test-logo.png';
  const updatedBy = 'MOCK_tester';

  afterAll(async () => {
    await Logo.destroy({ where: { updatedBy: { [require('sequelize').Op.like]: 'MOCK%' } } });
  });

  it('should upload a logo', async () => {
    const res = await request(app)
      .post('/api/logos/upload')
      .field('updatedBy', updatedBy)
      .attach('logo', Buffer.from('fake image'), 'test-logo.png');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.logo).toBeDefined();
    logoId = res.body.logo.id;
  });

  it('should create or update a logo', async () => {
    const res = await request(app)
      .post('/api/logos')
      .send({ logoUrl, updatedBy });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.logo).toBeDefined();
    logoId = res.body.logo.id;
  });

  it('should get a logo by id', async () => {
    const res = await request(app)
      .get(`/api/logos/${logoId}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.logo).toBeDefined();
  });

  it('should get all logos', async () => {
    const res = await request(app)
      .get('/api/logos');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.logos)).toBe(true);
  });

  it('should update a logo', async () => {
    const res = await request(app)
      .put(`/api/logos/${logoId}`)
      .send({ name: 'Updated Logo', url: '/logos/updated.png', updatedBy });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.logo.name).toBe('Updated Logo');
  });

  it('should delete a logo', async () => {
    const res = await request(app)
      .delete(`/api/logos/${logoId}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('should fail to upload non-image file', async () => {
    const res = await request(app)
      .post('/api/logos/upload')
      .field('updatedBy', updatedBy)
      .attach('logo', Buffer.from('not an image'), 'test.txt');
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('File must be an image');
  });

  it('should fail to upload file with wrong extension', async () => {
    const res = await request(app)
      .post('/api/logos/upload')
      .field('updatedBy', updatedBy)
      .attach('logo', Buffer.from('fake image'), 'test.svg');
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/File extension must be an image type/);
  });

  it('should fail to create logo without logoUrl', async () => {
    const res = await request(app)
      .post('/api/logos')
      .send({ updatedBy });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Missing logoUrl');
  });

  it('should return 404 for get by id with wrong id', async () => {
    const res = await request(app)
      .get('/api/logos/999999');
    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Logo not found');
  });

  it('should return 404 for update with wrong id', async () => {
    const res = await request(app)
      .put('/api/logos/999999')
      .send({ name: 'Updated Logo', url: '/logos/updated.png', updatedBy });
    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Logo not found');
  });

  it('should return 404 for delete with wrong id', async () => {
    const res = await request(app)
      .delete('/api/logos/999999');
    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Logo not found');
  });
});
