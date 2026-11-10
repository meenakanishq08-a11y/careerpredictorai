const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/User');
const Profile = require('../src/models/Profile');
const Recommendation = require('../src/models/Recommendation');

// Mock the LLM service so tests don't call OpenAI
jest.mock('../src/services/llm.service', () => ({
  getLLMRecommendations: jest.fn().mockResolvedValue({
    summary: 'Mock summary for testing.',
    careerPaths: [
      {
        title: 'Software Engineer',
        fitScore: 90,
        reasons: ['Good skills'],
        requiredSkills: ['JavaScript', 'React'],
        missingSkills: ['Docker'],
        learningRoadmap: [{ step: 'Learn Docker', completed: false }],
        resources: [{ title: 'Docker Docs', url: 'https://docs.docker.com' }],
      },
      {
        title: 'Data Scientist',
        fitScore: 75,
        reasons: ['Analytical'],
        requiredSkills: ['Python', 'ML'],
        missingSkills: ['TensorFlow'],
        learningRoadmap: [{ step: 'Learn TensorFlow', completed: false }],
        resources: [{ title: 'TF Docs', url: 'https://tensorflow.org' }],
      },
      {
        title: 'Product Manager',
        fitScore: 60,
        reasons: ['Leadership'],
        requiredSkills: ['Strategy', 'SQL'],
        missingSkills: ['OKRs'],
        learningRoadmap: [{ step: 'Read Inspired', completed: false }],
        resources: [{ title: 'Product School', url: 'https://productschool.com' }],
      },
      {
        title: 'DevOps Engineer',
        fitScore: 50,
        reasons: ['Technical background'],
        requiredSkills: ['Linux', 'AWS'],
        missingSkills: ['Terraform'],
        learningRoadmap: [{ step: 'Learn AWS', completed: false }],
        resources: [{ title: 'AWS Training', url: 'https://aws.amazon.com/training' }],
      },
    ],
  }),
}));

const USER1 = { name: 'Rec Tester 1', email: 'rectest1@example.com', password: 'password123' };
const USER2 = { name: 'Rec Tester 2', email: 'rectest2@example.com', password: 'password123' };
let token1, token2, userId1, recId;
const { connectTestDB, closeTestDB } = require('./testDb');

beforeAll(async () => {
  await connectTestDB();
  await User.deleteMany({ email: { $in: [USER1.email, USER2.email] } });

  const reg1 = await request(app).post('/api/auth/register').send(USER1);
  token1 = reg1.body.data.token;
  userId1 = reg1.body.data.user._id;

  const reg2 = await request(app).post('/api/auth/register').send(USER2);
  token2 = reg2.body.data.token;

  // Create profile for user1
  await request(app).put('/api/profile').set('Authorization', `Bearer ${token1}`).send({
    skills: ['JavaScript', 'React'],
    interests: ['Tech'],
    workStyle: 'remote',
    experienceYears: 2,
  });

  // Create profile for user2
  await request(app).put('/api/profile').set('Authorization', `Bearer ${token2}`).send({
    skills: ['Python'],
    interests: ['Data'],
    workStyle: 'onsite',
    experienceYears: 1,
  });
});

afterAll(async () => {
  await User.deleteMany({ email: { $in: [USER1.email, USER2.email] } });
  await closeTestDB();
});

describe('POST /api/recommendations', () => {
  it('generates recommendations for user with profile', async () => {
    const res = await request(app).post('/api/recommendations').set('Authorization', `Bearer ${token1}`);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.careerPaths).toHaveLength(4);
    recId = res.body.data._id;
  });

  it('requires auth', async () => {
    const res = await request(app).post('/api/recommendations');
    expect(res.status).toBe(401);
  });
});

describe('GET /api/recommendations', () => {
  it('returns recommendation history', async () => {
    const res = await request(app).get('/api/recommendations').set('Authorization', `Bearer ${token1}`);
    expect(res.status).toBe(200);
    expect(res.body.data.items.length).toBeGreaterThan(0);
  });
});

describe('GET /api/recommendations/:id', () => {
  it('returns a specific recommendation for owner', async () => {
    const res = await request(app).get(`/api/recommendations/${recId}`).set('Authorization', `Bearer ${token1}`);
    expect(res.status).toBe(200);
  });

  it('returns 403 for non-owner', async () => {
    const res = await request(app).get(`/api/recommendations/${recId}`).set('Authorization', `Bearer ${token2}`);
    expect(res.status).toBe(403);
  });
});

describe('PATCH /api/recommendations/:id/roadmap', () => {
  it('updates a roadmap step', async () => {
    const res = await request(app)
      .patch(`/api/recommendations/${recId}/roadmap`)
      .set('Authorization', `Bearer ${token1}`)
      .send({ pathIndex: 0, stepIndex: 0, completed: true });
    expect(res.status).toBe(200);
    expect(res.body.data.careerPaths[0].learningRoadmap[0].completed).toBe(true);
  });

  it('rejects roadmap update from non-owner', async () => {
    const res = await request(app)
      .patch(`/api/recommendations/${recId}/roadmap`)
      .set('Authorization', `Bearer ${token2}`)
      .send({ pathIndex: 0, stepIndex: 0, completed: true });
    expect(res.status).toBe(403);
  });
});

describe('POST /api/recommendations/simulate', () => {
  it('returns simulated scores', async () => {
    const res = await request(app)
      .post('/api/recommendations/simulate')
      .set('Authorization', `Bearer ${token1}`)
      .send({ recommendationId: recId, extraSkills: ['JavaScript', 'React'], removedSkills: [] });
    expect(res.status).toBe(200);
    expect(res.body.data.simulated).toHaveLength(4);
    expect(res.body.data.simulated[0].delta).toBeDefined();
  });
});

describe('DELETE /api/recommendations/:id', () => {
  it('prevents deletion by non-owner', async () => {
    const res = await request(app).delete(`/api/recommendations/${recId}`).set('Authorization', `Bearer ${token2}`);
    expect(res.status).toBe(403);
  });

  it('deletes by owner', async () => {
    const res = await request(app).delete(`/api/recommendations/${recId}`).set('Authorization', `Bearer ${token1}`);
    expect(res.status).toBe(200);
  });
});
