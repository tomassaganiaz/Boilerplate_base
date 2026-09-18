let totalRequests = 0;
let totalErrors = 0;
let totalLatency = 0;
let rateLimited = 0;
const startedAt = Date.now();

const metricsMiddleware = (req, res, next) => {
  const start = Date.now();
  totalRequests += 1;
  res.on('finish', () => {
    const latency = Date.now() - start;
    totalLatency += latency;
    if (res.statusCode >= 400) totalErrors += 1;
    if (res.statusCode === 429) rateLimited += 1;
  });
  next();
};

const getMetrics = () => ({
  totalRequests,
  totalErrors,
  avgLatencyMs: totalRequests > 0 ? Math.round(totalLatency / totalRequests) : 0,
  uptimeSeconds: Math.round((Date.now() - startedAt) / 1000),
  rateLimited,
  memoryUsage: process.memoryUsage(),
});

const resetMetrics = () => {
  totalRequests = 0;
  totalErrors = 0;
  totalLatency = 0;
  rateLimited = 0;
};

module.exports = { metricsMiddleware, getMetrics, resetMetrics };
