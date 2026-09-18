const request = require('supertest');
const app = require('../../src/app').default || require('../../src/app');

describe('Auth routes', () => {
  it('POST /api/v1/auth/login - success', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'admin@example.com', password: 'password123' });
    expect(res.status).toBe(200);
    expect(res.body.data.accessToken).toBeDefined();
  });
  it('POST /api/v1/auth/login - invalid credentials', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'admin@example.com', password: 'wrongpass' });
    expect(res.status).toBe(401);
  });
  it('POST /api/v1/auth/login - missing fields -> 400', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({ email: 'admin@example.com' });
    expect(res.status).toBe(400);
  });
  it('POST /api/v1/auth/refresh - success', async () => {
    const login = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'user@example.com', password: 'password123' });
    const refreshToken = login.body.data.refreshToken;
    const res = await request(app).post('/api/v1/auth/refresh').send({ refreshToken });
    expect(res.status).toBe(200);
    expect(res.body.data.accessToken).toBeDefined();
  });
  it('POST /api/v1/auth/refresh - invalid -> 401', async () => {
    const res = await request(app).post('/api/v1/auth/refresh').send({ refreshToken: 'invalid' });
    expect(res.status).toBe(401);
  });
  it('GET /api/v1/examples - unknown query param should 400 (strict validation)', async () => {
    const res = await request(app).get('/api/v1/examples?unknown=1');
    expect(res.status).toBe(400);
  });
  it('GET /api/v1/examples - X-Request-Id header present', async () => {
    const res = await request(app).get('/api/v1/examples');
    expect(res.headers['x-request-id']).toBeDefined();
  });
});
