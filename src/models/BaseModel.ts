import type { IRepository } from '../types';

// Contrato base para entidades — ISP: separa lectura/escritura
export interface BaseEntity {
  id: number | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  toJSON(): Record<string, unknown>;
}

// Clase abstracta que define el contrato del repositorio (DIP: servicios dependen de abstracción)
export abstract class BaseModel<T extends BaseEntity> implements IRepository<T> {
  static tableName = 'table_name';
  static primaryKey = 'id';

  id: number | null;
  createdAt: Date | null;
  updatedAt: Date | null;

  constructor(data: Partial<BaseEntity> = {}) {
    this.id = (data.id as number) ?? null;
    this.createdAt = (data.createdAt as Date) ?? null;
    this.updatedAt = (data.updatedAt as Date) ?? null;
  }

  // Métodos estáticos — cada modelo concreto implementa su persistencia
  static async findAll(_filters: Record<string, unknown> = {}): Promise<unknown[]> {
    throw new Error('Method not implemented');
  }
  static async findById(_id: string | number): Promise<unknown | null> {
    throw new Error('Method not implemented');
  }
  static async create(_data: unknown): Promise<unknown> {
    throw new Error('Method not implemented');
  }
  static async update(_id: string | number, _data: unknown): Promise<unknown | null> {
    throw new Error('Method not implemented');
  }
  static async delete(_id: string | number): Promise<boolean> {
    throw new Error('Method not implemented');
  }

  // Instancia: delega a implementación estática (LSP-safe)
  async findAll(): Promise<T[]> {
    throw new Error('Method not implemented');
  }
  async findById(): Promise<T | null> {
    throw new Error('Method not implemented');
  }
  async create(): Promise<T> {
    throw new Error('Method not implemented');
  }
  async update(): Promise<T | null> {
    throw new Error('Method not implemented');
  }
  async delete(): Promise<boolean> {
    throw new Error('Method not implemented');
  }

  toJSON(): Record<string, unknown> {
    const obj: Record<string, unknown> = {};
    Object.keys(this).forEach((key) => {
      const val = (this as unknown as Record<string, unknown>)[key];
      if (val !== undefined) obj[key] = val;
    });
    return obj;
  }
}

export default BaseModel;
