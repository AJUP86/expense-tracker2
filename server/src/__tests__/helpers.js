const request = require('supertest');
const app = require('../app');

async function createAuthenticatedUser(email = 'test@example.com') {
  await request(app).post('/api/auth/register').send({
    email,
    password: 'password123',
  });

  const loginRes = await request(app).post('/api/auth/login').send({
    email,
    password: 'password123',
  });

  return {
    token: loginRes.body.token,
    user: loginRes.body.user,
  };
}

async function createActivePeriod(token) {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 30);

  const periodRes = await request(app)
    .post('/api/periods')
    .set('Authorization', `Bearer ${token}`)
    .send({
      name: 'Test Period',
      endDate: tomorrow.toISOString(),
    });

  await request(app)
    .post(`/api/periods/${periodRes.body._id}/activate`)
    .set('Authorization', `Bearer ${token}`);

  return periodRes.body;
}

async function createBudget(token, data = {}) {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 30);

  const periodRes = await request(app)
    .post('/api/periods')
    .set('Authorization', `Bearer ${token}`)
    .send({
      name: data.periodName || 'Budget Period',
      endDate: tomorrow.toISOString(),
    });

  const budgetRes = await request(app)
    .post('/api/budgets')
    .set('Authorization', `Bearer ${token}`)
    .send({
      name: data.name || 'Test Budget',
      amount: data.amount || 500,
      type: data.type || 'fixed',
    });

  await request(app)
    .post(`/api/periods/${periodRes.body._id}/activate`)
    .set('Authorization', `Bearer ${token}`);

  return {
    budget: budgetRes.body,
    period: periodRes.body,
  };
}

module.exports = {
  createAuthenticatedUser,
  createActivePeriod,
  createBudget,
};

