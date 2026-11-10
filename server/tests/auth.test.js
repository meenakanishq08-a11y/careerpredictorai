const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/User');
const { connectTestDB, closeTestDB } = require('./testDb');

const TEST_USER = {
  name: 'Test User',
  email: 'testauth@example.com',
  password: 'password123',
};

beforeAll(async () => {
  await connectTestDB();
  await User.deleteMany({ email: TEST_USER.email });
});

afterAll(async () => {
  await User.deleteMany({ email: TEST_USER.email });
  await closeTestDB();
});

describe('POST /api/auth/register', () => {
  it('registers a new user', async () => {
    const res = await request(app).post('/api/auth/register').send(TEST_USER);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user.passwordHash).toBeUndefined();
  });

  it('rejects duplicate email', async () => {
    const res = await request(app).post('/api/auth/register').send(TEST_USER);
    expect(res.status).toBe(400);
  });

  it('rejects invalid email', async () => {
    const res = await request(app).post('/api/auth/register').send({ ...TEST_USER, email: 'notanemail' });
    expect(res.status).toBe(400);
  });

  it('rejects short password', async () => {
    const res = await request(app).post('/api/auth/register').send({ ...TEST_USER, password: '123' });
    expect(res.status).toBe(400);
  });
});

describe('POST /api/auth/login', () => {
  it('logs in with correct credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: TEST_USER.email, password: TEST_USER.password });
    expect(res.status).toBe(200);
    expect(res.body.data.token).toBeDefined();
  });

  it('rejects wrong password', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: TEST_USER.email, password: 'wrongpassword' });
    expect(res.status).toBe(401);
  });

  it('rejects non-existent email', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'nobody@example.com', password: 'password123' });
    expect(res.status).toBe(401);
  });
});

describe('GET /api/auth/me', () => {
  let token;
  beforeAll(async () => {
    const res = await request(app).post('/api/auth/login').send({ email: TEST_USER.email, password: TEST_USER.password });
    token = res.body.data.token;
  });

  it('returns current user with valid token', async () => {
    const res = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data.user.email).toBe(TEST_USER.email);
  });

  it('returns 401 without token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });
});
