const ExampleModel = require('../models/ExampleModel');
const BaseService = require('./BaseService');

class ExampleService extends BaseService {
  constructor() {
    super(ExampleModel);
  }

  async getByName(name) {
    const entities = await this.Model.findAll({ name });
    return entities;
  }

  async getActive() {
    const entities = await this.Model.findAll({ status: 'active' });
    return entities;
  }
}

module.exports = new ExampleService();
