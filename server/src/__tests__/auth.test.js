const request = require('supertest');
const app = require('../app');

describe('Auth API', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app).post('/api/auth/register').send({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.email).toBe('test@example.com');
    });

    it('should reject invalid email', async () => {
      const res = await request(app).post('/api/auth/register').send({
        email: 'invalid-email',
        password: 'password123',
      });

      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/email/i);
    });

    it('should reject short password', async () => {
      const res = await request(app).post('/api/auth/register').send({
        email: 'test@example.com',
        password: '123',
      });

      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/8 characters/i);
    });

    it('should reject duplicate email', async () => {
      await request(app).post('/api/auth/register').send({
        email: 'duplicate@example.com',
        password: 'password123',
      });

      const res = await request(app).post('/api/auth/register').send({
        email: 'duplicate@example.com',
        password: 'password123',
      });

      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/already exists/i);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await request(app).post('/api/auth/register').send({
        email: 'login@example.com',
        password: 'password123',
      });
    });

    it('should login with valid credentials', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'login@example.com',
        password: 'password123',
      });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user.email).toBe('login@example.com');
    });

    it('should reject wrong password', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'login@example.com',
        password: 'wrongpassword',
      });

      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/invalid/i);
    });

    it('should reject non-existent user', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'nonexistent@example.com',
        password: 'password123',
      });

      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/invalid/i);
    });
  });

  describe('Protected Routes', () => {
    it('should reject requests without token', async () => {
      const res = await request(app).get('/api/expenses');

      expect(res.status).toBe(401);
      expect(res.body.message).toMatch(/unauthorized/i);
    });

    it('should reject requests with invalid token', async () => {
      const res = await request(app)
        .get('/api/expenses')
        .set('Authorization', 'Bearer invalid-token');

      expect(res.status).toBe(401);
      expect(res.body.message).toMatch(/invalid/i);
    });

    it('should accept requests with valid token', async () => {
      await request(app).post('/api/auth/register').send({
        email: 'protected@example.com',
        password: 'password123',
      });

      const loginRes = await request(app).post('/api/auth/login').send({
        email: 'protected@example.com',
        password: 'password123',
      });

      const res = await request(app)
        .get('/api/expenses')
        .set('Authorization', `Bearer ${loginRes.body.token}`);

      expect(res.status).toBe(200);
    });
  });
});

