const request = require('supertest');
const app = require('../../app');
const db = require('../setup/db');

// No DB needed for status endpoint, but good practice to include setup
beforeAll(async () => await db.connect());
afterAll(async () => await db.closeDatabase());

describe('Status API Integration Test', () => {
  it('GET /api/status - should return 200 and OK message', async () => {
    const res = await request(app).get('/api/status');
    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toBe('OK');
    expect(res.body.message).toBe('Backend running');
  });

  it('GET /api/unknown - should return 404 for undefined routes', async () => {
    const res = await request(app).get('/api/unknown');
    expect(res.statusCode).toEqual(404);
    expect(res.body.message).toBe('API route not found');
  });
});
