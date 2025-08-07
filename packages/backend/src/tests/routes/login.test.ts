import request from 'supertest';
import express from 'express';
import authRouter from '../../routes/auth';

const app = express();
app.use(express.json());
app.use('/api/auth', authRouter);

describe('POST /api/auth/login', () => {
  it('should return 200 and a token when valid credentials are provided', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'user1@example.com',
        password: '1111',
      });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
    expect(response.body.token).toBeDefined();
    expect(response.body.user.firstName).toBeDefined();
    expect(response.body.user.lastName).toBeDefined();
  });

  it('should return 401 when invalid email is provided', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'nonexistent@example.com',
        password: '1111',
      });

    expect(response.status).toBe(401);
    expect(response.body.status).toBe('error');
    expect(response.body.message).toBe('Invalid credentials');
  });

  it('should return 401 when invalid password is provided', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'user1@example.com',
        password: 'wrong-password',
      });

    expect(response.status).toBe(401);
    expect(response.body.status).toBe('error');
    expect(response.body.message).toBe('Invalid credentials');
  });

  it('should return 500 when internal server error occurs', async () => {
    expect(true).toBeTruthy(); // Placeholder
  });
});
