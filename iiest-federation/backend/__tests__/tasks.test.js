// backend/__tests__/tasks.test.js
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');

beforeAll(async () => {
  await mongoose.connect('mongodb://localhost:27017/iiest_test');
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe('Task API', () => {
  let taskId;

  it('POST /api/tasks - creates a task', async () => {
    const res = await request(app).post('/api/tasks').send({
      assignedTo: 'User 1',
      status: 'Not Started',
      dueDate: '2024-12-01',
      priority: 'High',
      comments: 'Test task'
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.assignedTo).toBe('User 1');
    taskId = res.body._id;
  });

  it('GET /api/tasks - returns all tasks', async () => {
    const res = await request(app).get('/api/tasks');
    expect(res.statusCode).toBe(200);
    expect(res.body.tasks).toBeInstanceOf(Array);
    expect(res.body.total).toBeGreaterThan(0);
  });

  it('GET /api/tasks/:id - returns a single task', async () => {
    const res = await request(app).get(`/api/tasks/${taskId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(taskId);
  });

  it('PUT /api/tasks/:id - updates a task', async () => {
    const res = await request(app).put(`/api/tasks/${taskId}`).send({
      status: 'In Progress',
      priority: 'Normal'
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('In Progress');
  });

  it('GET /api/tasks?search=User - filters by search', async () => {
    const res = await request(app).get('/api/tasks?search=User');
    expect(res.statusCode).toBe(200);
    expect(res.body.tasks.length).toBeGreaterThan(0);
  });

  it('DELETE /api/tasks/:id - deletes a task', async () => {
    const res = await request(app).delete(`/api/tasks/${taskId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Task deleted');
  });

  it('GET /api/tasks/:id - returns 404 after deletion', async () => {
    const res = await request(app).get(`/api/tasks/${taskId}`);
    expect(res.statusCode).toBe(404);
  });
});
