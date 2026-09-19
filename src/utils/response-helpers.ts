import type { Response } from 'express';
import type { PaginatedMeta } from '../types';

export const successResponse = <T>(
  res: Response,
  data: T | null = null,
  message = 'Success',
  meta: PaginatedMeta | null = null,
  statusCode = 200,
): Response => {
  const response: Record<string, unknown> = { success: true, message, data };
  if (meta) response.meta = meta;
  return res.status(statusCode).json(response);
};

export const createdResponse = <T>(res: Response, data: T, message = 'Created successfully'): Response =>
  successResponse(res, data, message, null, 201);

export const noContentResponse = (res: Response): Response => res.status(204).send();

export const errorResponse = (
  res: Response,
  message = 'Error',
  statusCode = 500,
  code = 'ERROR',
): Response => res.status(statusCode).json({ success: false, error: { code, message } });

export const validationErrorResponse = (
  res: Response,
  message = 'Validation failed',
  details: unknown[] = [],
): Response =>
  res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message, details } });

export const paginatedResponse = <T>(
  res: Response,
  data: T,
  meta: PaginatedMeta,
  message = 'Success',
): Response => successResponse(res, data, message, meta);
