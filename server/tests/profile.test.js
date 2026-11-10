const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/User');
const Profile = require('../src/models/Profile');
const { connectTestDB, closeTestDB } = require('./testDb');

const TEST_USER = { name: 'Profile Tester', email: 'profiletest@example.com', password: 'password123' };
let token;

beforeAll(async () => {
  await connectTestDB();
  await User.deleteMany({ email: TEST_USER.email });
  await User.deleteMany({ email: 'profiletest2@example.com' });
  
  const reg = await request(app).post('/api/auth/register').send(TEST_USER);
  token = reg.body.data.token;
  
  // Clean up profiles
  const user = await User.findOne({ email: TEST_USER.email });
  await Profile.deleteMany({ userId: user._id });
});

afterAll(async () => {
  await User.deleteMany({ email: TEST_USER.email });
  await closeTestDB();
});

describe('Profile endpoints', () => {
  it('GET /api/profile returns null for new user', async () => {
    const res = await request(app).get('/api/profile').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toBeNull();
  });

  it('PUT /api/profile creates a profile', async () => {
    const profileData = {
      education: [{ degree: 'B.Sc Computer Science', institution: 'State University', year: 2022 }],
      skills: ['JavaScript', 'Python', 'React'],
      interests: ['AI', 'Web Development'],
      experienceYears: 2,
      workStyle: 'remote',
      preferredDomains: ['Tech', 'Startups'],
      careerGoal: 'Become a senior engineer',
    };
    const res = await request(app).put('/api/profile').set('Authorization', `Bearer ${token}`).send(profileData);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.skills).toContain('JavaScript');
  });

  it('GET /api/profile returns the profile', async () => {
    const res = await request(app).get('/api/profile').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data.skills).toContain('JavaScript');
  });

  it('PUT /api/profile updates the profile', async () => {
    const res = await request(app).put('/api/profile').set('Authorization', `Bearer ${token}`).send({
      skills: ['JavaScript', 'Python', 'React', 'TypeScript'],
      workStyle: 'hybrid',
    });
    expect(res.status).toBe(200);
    expect(res.body.data.skills).toContain('TypeScript');
    expect(res.body.data.workStyle).toBe('hybrid');
  });

  it('requires auth token', async () => {
    const res = await request(app).get('/api/profile');
    expect(res.status).toBe(401);
  });
});
