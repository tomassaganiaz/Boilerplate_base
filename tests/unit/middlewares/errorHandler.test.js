const { errorHandler, notFoundHandler } = require('../../../src/middlewares/errorHandler');
const { AppError } = require('../../../src/utils/errors');

describe('errorHandler', () => {
  let req, res, next;
  beforeEach(() => {
    req = {};
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
    process.env.NODE_ENV = 'test';
  });
  it('should handle AppError', () => {
    const err = new AppError('Not found', 404, 'NOT_FOUND');
    errorHandler(err, req, res, next);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
  });
  it('should handle TokenExpiredError', () => {
    const err = new Error('expired');
    err.name = 'TokenExpiredError';
    errorHandler(err, req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
  });
  it('should handle 404', () => {
    const req2 = { originalUrl: '/missing' };
    const res2 = {};
    notFoundHandler(req2, res2, next);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 404 }));
  });
});
