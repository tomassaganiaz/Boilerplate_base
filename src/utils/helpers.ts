import type { Request, Response, NextFunction } from 'express';
import config from '../config';

// Envuelve async handlers para propagar errores a next() — evita try/catch repetitivo
export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>) =>
  (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

export const serialize = <T extends object>(obj: T, keys: (keyof T)[]): Partial<T> => {
  if (!obj || !keys || !Array.isArray(keys)) return obj;
  const result: Partial<T> = {};
  keys.forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(obj, key)) result[key] = obj[key];
  });
  return result;
};

export const omit = <T extends object>(obj: T, keys: (keyof T)[]): Partial<T> => {
  if (!obj || !keys || !Array.isArray(keys)) return obj;
  const result = { ...obj };
  keys.forEach((key) => {
    delete result[key];
  });
  return result;
};

export const pick = serialize;

export const parseIntOrDefault = (value: unknown, defaultValue: number): number => {
  const parsed = parseInt(String(value), 10);
  return isNaN(parsed) ? defaultValue : parsed;
};

export const isProduction = (): boolean => config.env === 'production';
export const isDevelopment = (): boolean => config.env === 'development';
export const isTest = (): boolean => config.env === 'test';
