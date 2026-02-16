const request = require('supertest');
const app = require('../app');
const { createAuthenticatedUser } = require('./helpers');

describe('Period API', () => {
  let token;

  beforeEach(async () => {
    const auth = await createAuthenticatedUser();
    token = auth.token;
  });

  describe('POST /api/periods', () => {
    it('should create a period with name and endDate', async () => {
      const res = await request(app)
        .post('/api/periods')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'January 2026',
          endDate: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        });

      expect(res.status).toBe(201);
      expect(res.body.name).toBe('January 2026');
      expect(res.body.status).toBe('PLANNING');
    });

    it('should reject period without name', async () => {
      const res = await request(app)
        .post('/api/periods')
        .set('Authorization', `Bearer ${token}`)
        .send({
          endDate: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        });

      expect(res.status).toBe(400);
    });

    it('should reject period without endDate', async () => {
      const res = await request(app)
        .post('/api/periods')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'January 2026' });

      expect(res.status).toBe(400);
    });

    it('should reject when current period already exists', async () => {
      await request(app)
        .post('/api/periods')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'January 2026',
          endDate: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        });

      const res = await request(app)
        .post('/api/periods')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'February 2026',
          endDate: new Date(
            Date.now() + 60 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/current period already exists/i);
    });
  });

  describe('GET /api/periods', () => {
    it('should return empty array when no periods', async () => {
      const res = await request(app)
        .get('/api/periods')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toEqual([]);
      expect(res.body.pagination).toBeDefined();
      expect(res.body.pagination.total).toBe(0);
    });

    it('should return user periods with pagination', async () => {
      const period1 = await request(app)
        .post('/api/periods')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'January 2026',
          endDate: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        });

      await request(app)
        .post(`/api/periods/${period1.body._id}/activate`)
        .set('Authorization', `Bearer ${token}`);
      await request(app)
        .post(`/api/periods/${period1.body._id}/archive`)
        .set('Authorization', `Bearer ${token}`);

      await request(app)
        .post('/api/periods')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'February 2026',
          endDate: new Date(
            Date.now() + 60 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        });

      const res = await request(app)
        .get('/api/periods')
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

    it('should not return other user periods', async () => {
      await request(app)
        .post('/api/periods')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'January 2026',
          endDate: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        });

      const auth2 = await createAuthenticatedUser('other@example.com');

      const res = await request(app)
        .get('/api/periods')
        .set('Authorization', `Bearer ${auth2.token}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toEqual([]);
      expect(res.body.pagination.total).toBe(0);
    });

    it('should respect page and limit parameters', async () => {
      for (let i = 1; i <= 3; i++) {
        const period = await request(app)
          .post('/api/periods')
          .set('Authorization', `Bearer ${token}`)
          .send({
            name: `Period ${i}`,
            endDate: new Date(
              Date.now() + 30 * 24 * 60 * 60 * 1000,
            ).toISOString(),
          });

        await request(app)
          .post(`/api/periods/${period.body._id}/activate`)
          .set('Authorization', `Bearer ${token}`);
        await request(app)
          .post(`/api/periods/${period.body._id}/archive`)
          .set('Authorization', `Bearer ${token}`);
      }

      const res = await request(app)
        .get('/api/periods?page=2&limit=1')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.pagination).toEqual({
        page: 2,
        limit: 1,
        total: 3,
        totalPages: 3,
        hasNext: true,
        hasPrev: true,
      });
    });

    it('should cap limit at maximum value', async () => {
      const res = await request(app)
        .get('/api/periods?limit=500')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.pagination.limit).toBe(100);
    });
  });

  describe('GET /api/periods/current', () => {
    it('should return current PLANNING period', async () => {
      await request(app)
        .post('/api/periods')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'January 2026',
          endDate: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        });

      const res = await request(app)
        .get('/api/periods/current')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('PLANNING');
    });

    it('should return null when no current period', async () => {
      const res = await request(app)
        .get('/api/periods/current')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toBeNull();
    });
  });

  describe('POST /api/periods/:id/activate', () => {
    it('should activate PLANNING period', async () => {
      const period = await request(app)
        .post('/api/periods')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'January 2026',
          endDate: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        });

      const res = await request(app)
        .post(`/api/periods/${period.body._id}/activate`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ACTIVE');
    });

    it('should reject activating ARCHIVED period', async () => {
      const period = await request(app)
        .post('/api/periods')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'January 2026',
          endDate: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        });

      await request(app)
        .post(`/api/periods/${period.body._id}/activate`)
        .set('Authorization', `Bearer ${token}`);
      await request(app)
        .post(`/api/periods/${period.body._id}/archive`)
        .set('Authorization', `Bearer ${token}`);

      const res = await request(app)
        .post(`/api/periods/${period.body._id}/activate`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/cannot activate an archived period/i);
    });
  });

  describe('POST /api/periods/:id/archive', () => {
    it('should archive ACTIVE period', async () => {
      const period = await request(app)
        .post('/api/periods')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'January 2026',
          endDate: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        });

      await request(app)
        .post(`/api/periods/${period.body._id}/activate`)
        .set('Authorization', `Bearer ${token}`);

      const res = await request(app)
        .post(`/api/periods/${period.body._id}/archive`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ARCHIVED');
    });

    it('should reject archiving non-ACTIVE period', async () => {
      const period = await request(app)
        .post('/api/periods')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'January 2026',
          endDate: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        });

      const res = await request(app)
        .post(`/api/periods/${period.body._id}/archive`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(
        /only an active period can be archived/i,
      );
    });
  });
});
