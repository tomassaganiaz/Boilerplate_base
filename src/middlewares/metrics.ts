import type { Request, Response, NextFunction } from 'express';

// Métricas in-memory — SRP: solo recolección, sin dependencia externa
interface Metrics {
  totalRequests: number;
  totalErrors: number;
  avgLatencyMs: number;
  uptimeSeconds: number;
  rateLimited: number;
  memoryUsage: NodeJS.MemoryUsage;
}

let totalRequests = 0;
let totalErrors = 0;
let totalLatency = 0;
let rateLimited = 0;
const startedAt = Date.now();

export const metricsMiddleware = (req: Request, res: Response, next: NextFunction): void => {
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

export const getMetrics = (): Metrics => ({
  totalRequests,
  totalErrors,
  avgLatencyMs: totalRequests > 0 ? Math.round(totalLatency / totalRequests) : 0,
  uptimeSeconds: Math.round((Date.now() - startedAt) / 1000),
  rateLimited,
  memoryUsage: process.memoryUsage(),
});

// Para tests: resetear contadores
export const resetMetrics = (): void => {
  totalRequests = 0;
  totalErrors = 0;
  totalLatency = 0;
  rateLimited = 0;
};
