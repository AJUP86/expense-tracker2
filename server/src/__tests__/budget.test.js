const request = require('supertest');
const app = require('../app');
const { createAuthenticatedUser } = require('./helpers');

describe('Budget API', () => {
  let token;

  beforeEach(async () => {
    const auth = await createAuthenticatedUser();
    token = auth.token;
  });

  async function createPlanningPeriod(authToken) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 30);

    const res = await request(app)
      .post('/api/periods')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: 'Test Period',
        endDate: tomorrow.toISOString(),
      });

    return res.body;
  }

  describe('POST /api/budgets', () => {
    it('should create budget with PLANNING period', async () => {
      await createPlanningPeriod(token);

      const res = await request(app)
        .post('/api/budgets')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Groceries',
          amount: 500,
          type: 'fixed',
        });

      expect(res.status).toBe(201);
      expect(res.body.name).toBe('Groceries');
      expect(res.body.amount).toBe(500);
      expect(res.body.remaining).toBe(500);
      expect(res.body.type).toBe('fixed');
    });

    it('should reject budget without PLANNING period', async () => {
      const res = await request(app)
        .post('/api/budgets')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Groceries',
          amount: 500,
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/no planning period/i);
    });

    it('should reject budget when period is ACTIVE', async () => {
      const period = await createPlanningPeriod(token);

      await request(app)
        .post(`/api/periods/${period._id}/activate`)
        .set('Authorization', `Bearer ${token}`);

      const res = await request(app)
        .post('/api/budgets')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Groceries',
          amount: 500,
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/no planning period/i);
    });

    it('should reject budget without name', async () => {
      await createPlanningPeriod(token);

      const res = await request(app)
        .post('/api/budgets')
        .set('Authorization', `Bearer ${token}`)
        .send({
          amount: 500,
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/name/i);
    });

    it('should reject budget with invalid amount', async () => {
      await createPlanningPeriod(token);

      const res = await request(app)
        .post('/api/budgets')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Groceries',
          amount: -100,
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/positive number/i);
    });

    it('should reject budget with invalid type', async () => {
      await createPlanningPeriod(token);

      const res = await request(app)
        .post('/api/budgets')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Groceries',
          amount: 500,
          type: 'monthly',
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/invalid budget type/i);
    });

    it('should default to fixed type if not provided', async () => {
      await createPlanningPeriod(token);

      const res = await request(app)
        .post('/api/budgets')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Groceries',
          amount: 500,
        });

      expect(res.status).toBe(201);
      expect(res.body.type).toBe('fixed');
    });
  });

  describe('GET /api/budgets', () => {
    it('should return empty array when no budgets', async () => {
      const res = await request(app)
        .get('/api/budgets')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it('should return budgets for current period', async () => {
      await createPlanningPeriod(token);

      await request(app)
        .post('/api/budgets')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Groceries', amount: 500 });

      await request(app)
        .post('/api/budgets')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Entertainment', amount: 200 });

      const res = await request(app)
        .get('/api/budgets')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(2);
    });

    it('should not return other user budgets', async () => {
      await createPlanningPeriod(token);

      await request(app)
        .post('/api/budgets')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'User 1 Budget', amount: 500 });

      const auth2 = await createAuthenticatedUser('user2@example.com');

      const res = await request(app)
        .get('/api/budgets')
        .set('Authorization', `Bearer ${auth2.token}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(0);
    });
  });
});

