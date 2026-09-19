import type { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

// Añade correlationId a cada request — permite trazabilidad end-to-end
export const requestId = (req: Request & { id?: string }, res: Response, next: NextFunction): void => {
  const incoming = req.headers['x-request-id'] as string | undefined;
  const id = incoming && incoming.trim().length > 0 ? incoming : randomUUID();
  (req as unknown as Record<string, unknown>).id = id;
  res.setHeader('X-Request-Id', id);
  next();
};

export default requestId;
