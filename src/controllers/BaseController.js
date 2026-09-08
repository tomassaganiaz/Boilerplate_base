const { successResponse, createdResponse, noContentResponse, paginatedResponse } = require('../utils/response-helpers');
const { NotFoundError } = require('../utils/errors');

class BaseController {
  constructor(service) {
    if (!service) {
      throw new Error('Service is required');
    }
    this.service = service;
  }

  async getAll(req, res, next) {
    try {
      const filters = {
        ...req.query,
        limit: parseInt(req.query.limit, 10) || 20,
        page: parseInt(req.query.page, 10) || 1,
      };
      
      const offset = (filters.page - 1) * filters.limit;
      filters.offset = offset;
      
      const data = await this.service.getAll(filters);
      const total = data.length;
      
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

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const entity = await this.service.getById(id);
      
      if (!entity) {
        throw new NotFoundError('not found', this.service.Model.tableName);
      }
      
      return successResponse(res, entity);
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const entity = await this.service.create(req.body);
      return createdResponse(res, entity);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const entity = await this.service.update(id, req.body);
      
      if (!entity) {
        throw new NotFoundError('not found', this.service.Model.tableName);
      }
      
      return successResponse(res, entity, 'Updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await this.service.delete(id);
      return noContentResponse(res);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = BaseController;
