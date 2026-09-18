import type { Request, Response, NextFunction } from 'express';
import type { Schema } from 'joi';
import { ValidationError } from '../utils/errors';

type Property = 'body' | 'query' | 'params';

// Factory de validación — SRP: solo valida y normaliza req[property]
export const validate =
  (schema: Schema, property: Property = 'body') =>
  (req: Request, _res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(
      (req as unknown as Record<string, unknown>)[property],
      {
        abortEarly: false,
        stripUnknown: false,
        allowUnknown: false,
      }
    );

    if (error) {
      const details = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));
      next(new ValidationError('Validation failed', details));
      return;
    }

    (req as unknown as Record<string, unknown>)[property] = value;
    next();
  };

export const validateBody = (schema: Schema) => validate(schema, 'body');
export const validateQuery = (schema: Schema) => validate(schema, 'query');
export const validateParams = (schema: Schema) => validate(schema, 'params');
