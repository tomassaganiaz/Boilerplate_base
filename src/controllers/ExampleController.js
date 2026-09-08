const BaseController = require('./BaseController');
const exampleService = require('../services/ExampleService');

class ExampleController extends BaseController {
  constructor() {
    super(exampleService);
  }
}

module.exports = new ExampleController();
