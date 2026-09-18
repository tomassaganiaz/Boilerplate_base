import { BaseController } from './BaseController';
import exampleService from '../services/ExampleService';
import type { ExampleModel, ExampleFilters } from '../models/ExampleModel';

// OCP: extiende sin modificar base; inyecta servicio concreto (DIP)
class ExampleController extends BaseController<ExampleModel, ExampleFilters> {
  constructor() {
    super(exampleService as unknown as import('../types').IService<ExampleModel, ExampleFilters>);
  }
}

// Exporta singleton y clase para testing con DI
export const exampleController = new ExampleController();
export default exampleController;
