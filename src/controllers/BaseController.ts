import type { Request, Response, NextFunction } from 'express';
import type { IService } from '../types';
import { NotFoundError } from '../utils/errors';
import { successResponse, createdResponse, noContentResponse, paginatedResponse } from '../utils/response-helpers';

// SRP: solo traduce HTTP ↔ servicio; DIP: depende de IService (abstracción)
export class BaseController<T, F extends Record<string, any> = Record<string, any>> {
  protected readonly service: IService<T, F>;

  constructor(service: IService<T, F>) {
    if (!service) throw new Error('Service is required');
    this.service = service;
    // Bind para usar como handler sin perder this
    this.getAll = this.getAll.bind(this);
    this.getById = this.getById.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const filters = {
        ...req.query,
        limit: parseInt(req.query.limit as string, 10) || 20,
        page: parseInt(req.query.page as string, 10) || 1,
      } as F & { limit: number; page: number; offset: number };

      const offset = (filters.page - 1) * filters.limit;
      (filters as Record<string, unknown>).offset = offset;

      const data = await this.service.getAll(filters as unknown as F);
      const total = (data as unknown[]).length;

      return paginatedResponse(res, data, {
        page: filters.page,
        limit: filters.limit,
        total,
        pages: Math.ceil(total / filters.limit),
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { id } = req.params;
      const entity = await this.service.getById(id);
      if (!entity) {
        const tableName = (this.service as unknown as { Model?: { tableName?: string } }).Model?.tableName ?? 'Resource';
        throw new NotFoundError('not found', tableName);
      }
      return successResponse(res, entity);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const entity = await this.service.create(req.body);
      return createdResponse(res, entity);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { id } = req.params;
      const entity = await this.service.update(id, req.body);
      if (!entity) {
        const tableName = (this.service as unknown as { Model?: { tableName?: string } }).Model?.tableName ?? 'Resource';
        throw new NotFoundError('not found', tableName);
      }
      return successResponse(res, entity, 'Updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { id } = req.params;
      await this.service.delete(id);
      return noContentResponse(res);
    } catch (error) {
      next(error);
    }
  }
}

export default BaseController;
