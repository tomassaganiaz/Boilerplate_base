import type { Request, Response, NextFunction } from 'express';
import logger from '../config/logger';
import { AppError } from '../utils/errors';
import config from '../config';

export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction): void => {
  let error: AppError;

  if (err instanceof AppError) {
    error = err;
  } else if (err.name === 'JsonWebTokenError') {
    error = new AppError('Invalid token', 401, 'INVALID_TOKEN');
  } else if (err.name === 'TokenExpiredError') {
    error = new AppError('Token expired', 401, 'TOKEN_EXPIRED');
  } else if (err.name === 'ValidationError' && (err as unknown as { details: unknown }).details) {
    error = new AppError('Validation failed', 400, 'VALIDATION_ERROR');
    error.details = (err as unknown as { details: unknown }).details;
  } else {
    error = new AppError('Internal server error', 500, 'INTERNAL_ERROR');
  }

  if (config.env === 'development' && !error.isOperational) {
    logger.error(err);
  }

  const response: Record<string, unknown> = {
    success: false,
    error: { code: error.code, message: error.message },
  };

  if (error.details) (response.error as Record<string, unknown>).details = error.details;
  if (config.env === 'development' && !error.isOperational) {
    (response.error as Record<string, unknown>).stack = error.stack;
  }

  res.status(error.statusCode).json(response);
};

export const notFoundHandler = (req: Request, _res: Response, next: NextFunction): void => {
  const error = new AppError(`Route ${req.originalUrl} not found`, 404, 'ROUTE_NOT_FOUND');
  next(error);
};
