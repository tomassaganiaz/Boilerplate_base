import type { Request, Response, NextFunction } from 'express';

// Métricas in-memory — SRP: solo recolección, sin dependencia externa
interface Metrics {
  totalRequests: number;
  totalErrors: number;
  avgLatencyMs: number;
  uptimeSeconds: number;
}

let totalRequests = 0;
let totalErrors = 0;
let totalLatency = 0;
const startedAt = Date.now();

export const metricsMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();
  totalRequests += 1;

  res.on('finish', () => {
    const latency = Date.now() - start;
    totalLatency += latency;
    if (res.statusCode >= 400) totalErrors += 1;
  });

  next();
};

export const getMetrics = (): Metrics => ({
  totalRequests,
  totalErrors,
  avgLatencyMs: totalRequests > 0 ? Math.round(totalLatency / totalRequests) : 0,
  uptimeSeconds: Math.round((Date.now() - startedAt) / 1000),
});

// Para tests: resetear contadores
export const resetMetrics = (): void => {
  totalRequests = 0;
  totalErrors = 0;
  totalLatency = 0;
};
