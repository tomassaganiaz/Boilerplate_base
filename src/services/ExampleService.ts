import { ExampleModel, type ExampleAttributes, type ExampleFilters } from '../models/ExampleModel';
import { BaseService } from './BaseService';

// OCP: extiende sin modificar BaseService; inyecta dependencia por constructor (DIP)
export class ExampleService extends BaseService<ExampleModel, ExampleFilters> {
  constructor(model: typeof ExampleModel = ExampleModel) {
    // Adaptador para cumplir ModelContract con métodos estáticos
    super({
      findAll: (f) => model.findAll(f),
      findById: (id) => model.findById(id),
      create: (d) => model.create(d as Partial<ExampleAttributes>),
      update: (id, d) => model.update(id, d as Partial<ExampleAttributes>),
      delete: (id) => model.delete(id),
      tableName: model.tableName,
    });
    this.ModelRef = model;
  }

  private readonly ModelRef: typeof ExampleModel;

  async getByName(name: string): Promise<ExampleModel[]> {
    return this.ModelRef.findAll({ name } as ExampleFilters);
  }

  async getActive(): Promise<ExampleModel[]> {
    return this.ModelRef.findAll({ status: 'active' });
  }
}

// Singleton por compatibilidad; preferir instanciación con DI en tests/controladores
export const exampleService = new ExampleService();
export default exampleService;
