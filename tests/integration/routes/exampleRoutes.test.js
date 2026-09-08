const request = require('supertest');
const express = require('express');
const exampleRoutes = require('../../../src/routes/exampleRoutes');
const exampleController = require('../../../src/controllers/ExampleController');
const { authenticate, authorize } = require('../../../src/middlewares/auth');

jest.mock('../../../src/controllers/ExampleController');
jest.mock('../../../src/middlewares/auth', () => ({
  authenticate: jest.fn((req, res, next) => next()),
  optionalAuth: jest.fn((req, res, next) => next()),
  authorize: jest.fn(() => (req, res, next) => next()),
}));

const app = express();
app.use(express.json());
app.use('/api/v1/examples', exampleRoutes);

describe('Example Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/v1/examples', () => {
    it('should call controller.getAll', async () => {
      const mockData = [{ id: 1, name: 'Test' }];
      exampleController.getAll.mockImplementation((req, res, _next) => {
        res.json({ success: true, data: mockData });
      });
      authenticate.mockImplementation((req, res, next) => next());
      authorize.mockImplementation(() => (req, res, next) => next());

      const response = await request(app)
        .get('/api/v1/examples')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockData);
    });
  });

  describe('GET /api/v1/examples/:id', () => {
    it('should call controller.getById with id', async () => {
      const mockEntity = { id: 1, name: 'Test' };
      exampleController.getById.mockImplementation((req, res, _next) => {
        res.json({ success: true, data: mockEntity });
      });
      authenticate.mockImplementation((req, res, next) => next());

      const response = await request(app)
        .get('/api/v1/examples/1')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockEntity);
    });
  });

  describe('POST /api/v1/examples', () => {
    it('should call controller.create with body', async () => {
      const newEntity = { name: 'New', description: 'New desc' };
      const createdEntity = { id: 1, ...newEntity };
      
      exampleController.create.mockImplementation((req, res, _next) => {
        res.status(201).json({ success: true, data: createdEntity });
      });
      authenticate.mockImplementation((req, res, next) => {
        req.user = { id: 1, role: 'admin' };
        next();
      });
      authorize.mockImplementation(() => (req, res, next) => next());

      const response = await request(app)
        .post('/api/v1/examples')
        .send(newEntity)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(createdEntity);
    });
  });

  describe('PUT /api/v1/examples/:id', () => {
    it('should call controller.update with id and body', async () => {
      const updatedEntity = { id: 1, name: 'Updated' };
      
      exampleController.update.mockImplementation((req, res, _next) => {
        res.json({ success: true, data: updatedEntity });
      });
      authenticate.mockImplementation((req, res, next) => {
        req.user = { id: 1, role: 'admin' };
        next();
      });
      authorize.mockImplementation(() => (req, res, next) => next());

      const response = await request(app)
        .put('/api/v1/examples/1')
        .send({ name: 'Updated' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(updatedEntity);
    });
  });

  describe('DELETE /api/v1/examples/:id', () => {
    it('should call controller.delete with id', async () => {
      exampleController.delete.mockImplementation((req, res, _next) => {
        res.status(204).send();
      });
      authenticate.mockImplementation((req, res, next) => {
        req.user = { id: 1, role: 'admin' };
        next();
      });
      authorize.mockImplementation(() => (req, res, next) => next());

      await request(app)
        .delete('/api/v1/examples/1')
        .expect(204);
    });
  });
});
