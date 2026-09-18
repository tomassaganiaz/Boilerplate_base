import type { IService } from '../types';

// Interfaz de modelo inyectable — DIP: servicio no conoce implementación concreta
export interface ModelContract<T, F = Record<string, unknown>> {
  findAll(filters?: F): Promise<T[]>;
  findById(id: string | number): Promise<T | null>;
  create(data: Partial<T>): Promise<T>;
  update(id: string | number, data: Partial<T>): Promise<T | null>;
  delete(id: string | number): Promise<boolean>;
  tableName?: string;
}

// SRP: solo orquesta lógica de negocio y valida entradas
export class BaseService<T, F = Record<string, unknown>> implements IService<T, F> {
  protected readonly Model: ModelContract<T, F>;

  constructor(model: ModelContract<T, F>) {
    if (!model) throw new Error('Model is required');
    this.Model = model;
  }

  async getAll(filters: F = {} as F): Promise<T[]> {
    return this.Model.findAll(filters);
  }

  async getById(id: string | number): Promise<T | null> {
    if (!id) throw new Error('ID is required');
    return this.Model.findById(id);
  }

  async create(data: Partial<T>): Promise<T> {
    if (!data || Object.keys(data).length === 0) throw new Error('Data is required');
    return this.Model.create(data);
  }

  async update(id: string | number, data: Partial<T>): Promise<T | null> {
    if (!id) throw new Error('ID is required');
    if (!data || Object.keys(data).length === 0) throw new Error('Data is required');
    return this.Model.update(id, data);
  }

  async delete(id: string | number): Promise<boolean> {
    if (!id) throw new Error('ID is required');
    return this.Model.delete(id);
  }
}

export default BaseService;
