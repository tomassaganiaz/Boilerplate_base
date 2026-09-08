class BaseService {
  constructor(model) {
    if (!model) {
      throw new Error('Model is required');
    }
    this.Model = model;
  }

  async getAll(filters = {}) {
    const entities = await this.Model.findAll(filters);
    return entities;
  }

  async getById(id) {
    if (!id) {
      throw new Error('ID is required');
    }
    const entity = await this.Model.findById(id);
    if (!entity) {
      return null;
    }
    return entity;
  }

  async create(data) {
    if (!data || Object.keys(data).length === 0) {
      throw new Error('Data is required');
    }
    const entity = await this.Model.create(data);
    return entity;
  }

  async update(id, data) {
    if (!id) {
      throw new Error('ID is required');
    }
    if (!data || Object.keys(data).length === 0) {
      throw new Error('Data is required');
    }
    const entity = await this.Model.update(id, data);
    return entity;
  }

  async delete(id) {
    if (!id) {
      throw new Error('ID is required');
    }
    const result = await this.Model.delete(id);
    return result;
  }
}

module.exports = BaseService;
