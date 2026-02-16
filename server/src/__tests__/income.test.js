const request = require('supertest');
const app = require('../app');
const { createAuthenticatedUser } = require('./helpers');

describe('Income API', () => {
  let token;
  let userId;

  beforeEach(async () => {
    const auth = await createAuthenticatedUser(`income-${Date.now()}@test.com`);
    token = auth.token;
    userId = auth.user.id;
  });

  const createPlanningPeriod = async () => {
    const res = await request(app)
      .post('/api/periods')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Test Period', endDate: new Date(Date.now() + 86400000) });
    return res.body;
  };

  describe('POST /api/incomes/:periodId', () => {
    it('should create income with PLANNING period', async () => {
      const period = await createPlanningPeriod();

      const res = await request(app)
        .post(`/api/incomes/${period._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Salary', amount: 5000 });

      expect(res.status).toBe(201);
      expect(res.body.name).toBe('Salary');
      expect(res.body.amount).toBe(5000);
      expect(res.body.periodId).toBe(period._id);
    });

    it('should reject income when period is ACTIVE', async () => {
      const period = await createPlanningPeriod();

      await request(app)
        .post(`/api/periods/${period._id}/activate`)
        .set('Authorization', `Bearer ${token}`);

      const res = await request(app)
        .post(`/api/incomes/${period._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Salary', amount: 5000 });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('PLANNING');
    });

    it('should reject income with invalid name', async () => {
      const period = await createPlanningPeriod();

      const res = await request(app)
        .post(`/api/incomes/${period._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: '', amount: 5000 });

      expect(res.status).toBe(400);
    });

    it('should reject income with invalid amount', async () => {
      const period = await createPlanningPeriod();

      const res = await request(app)
        .post(`/api/incomes/${period._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Salary', amount: -100 });

      expect(res.status).toBe(400);
    });

    it('should reject income for non-existent period', async () => {
      const fakeId = '507f1f77bcf86cd799439011';

      const res = await request(app)
        .post(`/api/incomes/${fakeId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Salary', amount: 5000 });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('not found');
    });
  });

  describe('GET /api/incomes/:periodId', () => {
    it('should return empty array when no incomes', async () => {
      const period = await createPlanningPeriod();

      const res = await request(app)
        .get(`/api/incomes/${period._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toEqual([]);
      expect(res.body.pagination).toBeDefined();
      expect(res.body.pagination.total).toBe(0);
    });

    it('should return incomes for period with pagination', async () => {
      const period = await createPlanningPeriod();

      await request(app)
        .post(`/api/incomes/${period._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Salary', amount: 5000 });

      await request(app)
        .post(`/api/incomes/${period._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Bonus', amount: 1000 });

      const res = await request(app)
        .get(`/api/incomes/${period._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(2);
      expect(res.body.pagination).toEqual({
        page: 1,
        limit: 20,
        total: 2,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      });
    });

    it('should not return other user incomes', async () => {
      const period = await createPlanningPeriod();

      await request(app)
        .post(`/api/incomes/${period._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Salary', amount: 5000 });

      const otherUser = await createAuthenticatedUser(
        `other-${Date.now()}@test.com`,
      );

      const res = await request(app)
        .get(`/api/incomes/${period._id}`)
        .set('Authorization', `Bearer ${otherUser.token}`);

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('not found');
    });

    it('should respect page and limit parameters', async () => {
      const period = await createPlanningPeriod();

      for (let i = 1; i <= 5; i++) {
        await request(app)
          .post(`/api/incomes/${period._id}`)
          .set('Authorization', `Bearer ${token}`)
          .send({ name: `Income ${i}`, amount: i * 1000 });
      }

      const res = await request(app)
        .get(`/api/incomes/${period._id}?page=2&limit=2`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(2);
      expect(res.body.pagination).toEqual({
        page: 2,
        limit: 2,
        total: 5,
        totalPages: 3,
        hasNext: true,
        hasPrev: true,
      });
    });

    it('should cap limit at maximum value', async () => {
      const period = await createPlanningPeriod();

      const res = await request(app)
        .get(`/api/incomes/${period._id}?limit=500`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.pagination.limit).toBe(100);
    });
  });
});
