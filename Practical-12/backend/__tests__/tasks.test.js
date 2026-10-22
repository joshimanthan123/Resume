const request = require('supertest');
const app = require('../app');

// ======================================================
// Practical 12: CI/CD Pipeline - Automated Test Suite
// These tests run automatically via GitHub Actions on
// every push to the main branch.
// ======================================================

describe('Task Management API - CI/CD Test Suite', () => {

  // ----- GET /api/health -----
  describe('GET /api/health', () => {
    test('should return 200 and online status', async () => {
      const res = await request(app).get('/api/health');
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('online');
    });
  });

  // ----- GET /api/tasks -----
  describe('GET /api/tasks', () => {
    test('should return status 200', async () => {
      const res = await request(app).get('/api/tasks');
      expect(res.statusCode).toBe(999); // ← DELIBERATELY BROKEN for CI failure demo
    });

    test('should return an object with a data array', async () => {
      const res = await request(app).get('/api/tasks');
      expect(res.body).toHaveProperty('data');
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    test('should return at least one task', async () => {
      const res = await request(app).get('/api/tasks');
      expect(res.body.data.length).toBeGreaterThan(0);
    });
  });

  // ----- POST /api/tasks -----
  describe('POST /api/tasks', () => {
    test('should create a new task and return 201', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .send({ title: 'CI Test Task', category: 'Testing', priority: 'High', user: 'CIBot' });
      expect(res.statusCode).toBe(201);
      expect(res.body.data).toHaveProperty('_id');
      expect(res.body.data.title).toBe('CI Test Task');
    });

    test('should return 400 if title is missing', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .send({ category: 'Testing' });
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('Task title is required');
    });
  });

  // ----- DELETE /api/tasks/:id -----
  describe('DELETE /api/tasks/:id', () => {
    test('should return 404 for a non-existent task id', async () => {
      const res = await request(app).delete('/api/tasks/nonexistent-id-9999');
      expect(res.statusCode).toBe(404);
    });

    test('should delete an existing task and return 200', async () => {
      // First create a task
      const createRes = await request(app)
        .post('/api/tasks')
        .send({ title: 'Task to Delete', user: 'CIBot' });
      const taskId = createRes.body.data._id;

      // Then delete it
      const deleteRes = await request(app).delete(`/api/tasks/${taskId}`);
      expect(deleteRes.statusCode).toBe(200);
      expect(deleteRes.body.deletedTaskId).toBe(taskId);
    });
  });

});
