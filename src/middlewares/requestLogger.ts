import type { Request, Response, NextFunction } from 'express';
import logger from '../config/logger';

const requestLogger = (req: Request & { id?: string }, res: Response, next: NextFunction): void => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    const requestId = (req as unknown as Record<string, unknown>).id ?? res.getHeader('X-Request-Id') ?? '-';
    const logMessage = `${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms [${requestId}]`;
    if (res.statusCode >= 400) logger.error(logMessage);
    else logger.info(logMessage);
  });
  next();
};

export default requestLogger;
