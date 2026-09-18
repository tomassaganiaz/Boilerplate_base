const requestIdMod = require('../../../src/middlewares/requestId');
const requestId = requestIdMod.default || requestIdMod;
const { getMetrics, resetMetrics } = require('../../../src/middlewares/metrics');

describe('requestId', () => {
  it('should generate uuid if not provided', () => {
    const req = { headers: {} };
    const res = { setHeader: jest.fn() };
    const next = jest.fn();
    requestId(req, res, next);
    expect(res.setHeader).toHaveBeenCalledWith('X-Request-Id', expect.any(String));
    expect(req.id).toBeDefined();
    expect(next).toHaveBeenCalled();
  });
  it('should reuse incoming x-request-id', () => {
    const req = { headers: { 'x-request-id': 'test-123' } };
    const res = { setHeader: jest.fn() };
    const next = jest.fn();
    requestId(req, res, next);
    expect(res.setHeader).toHaveBeenCalledWith('X-Request-Id', 'test-123');
    expect(req.id).toBe('test-123');
  });
});

describe('metrics', () => {
  beforeEach(resetMetrics);
  it('should track requests', () => {
    const m = getMetrics();
    expect(m.totalRequests).toBe(0);
    expect(m.memoryUsage).toBeDefined();
  });
});
