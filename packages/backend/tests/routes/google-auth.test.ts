import request from 'supertest';
import express from 'express';
import googleAuthRouter from '../../src/routes/google-auth';
import * as googleAuthController from '../../src/controllers/google-auth'
import client from '../../src/db/connection'; 

const app = express();
app.use(express.json());
app.use(googleAuthRouter);

jest.mock('../../src/controllers/google-auth', () => ({
  ...jest.requireActual('../../src/controllers/google-auth'),
  auth: jest.fn(),
}));

afterAll(async () => {
  await client.end(); 
});

describe('POST /verify-google-token', () => {
  it('should return 400 if no token is provided', async () => {
    const response = await request(app).post('/verify-google-token').send({});
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe('No token provided');
  });

  it('should return 400 if the user does not have permission', async () => {
    const mockIdToken = 'some-id-token';

    (googleAuthController.auth as jest.Mock).mockResolvedValueOnce(false);

    const response = await request(app)
      .post('/verify-google-token')
      .send({ idToken: mockIdToken });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe('you dont have permission to access this system');
  });

  it('should return success if the token is valid and the user has permission', async () => {
    const mockIdToken = 'valid-id-token';

    (googleAuthController.auth as jest.Mock).mockResolvedValueOnce(true);

    const response = await request(app)
      .post('/verify-google-token')
      .send({ idToken: mockIdToken });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.headers['idtoken']).toBe(mockIdToken);
  });

  it('should handle internal errors properly', async () => {
    const mockIdToken = 'some-id-token';

    (googleAuthController.auth as jest.Mock).mockRejectedValueOnce(new Error('Internal server error'));

    const response = await request(app)
      .post('/verify-google-token')
      .send({ idToken: mockIdToken });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe('Internal server error');
  });
});
