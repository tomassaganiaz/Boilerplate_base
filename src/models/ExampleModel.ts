import { BaseModel, type BaseEntity } from './BaseModel';

export interface ExampleAttributes extends BaseEntity {
  name: string;
  description: string;
  status: 'active' | 'inactive';
}

export interface ExampleFilters {
  status?: 'active' | 'inactive';
  name?: string;
  limit?: number;
  offset?: number;
}

// Modelo concreto en memoria — SRP: solo persistencia y mapeo
export class ExampleModel extends BaseModel<ExampleModel> implements ExampleAttributes {
  static override tableName = 'examples';
  static override primaryKey = 'id';
  static records: Map<number, Record<string, unknown>> = new Map<number, Record<string, unknown>>([
    [1, { id: 1, name: 'Example', status: 'active' }],
  ]);

  declare id: number | null;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  declare createdAt: Date | null;
  declare updatedAt: Date | null;

  constructor(data: Partial<ExampleAttributes> = {}) {
    super(data);
    this.id = (data.id as number) ?? null;
    this.name = data.name ?? '';
    this.description = data.description ?? '';
    this.status = (data.status as 'active' | 'inactive') ?? 'active';
    this.createdAt = (data.createdAt as Date) ?? null;
    this.updatedAt = (data.updatedAt as Date) ?? null;
  }

  static async findAll(filters: ExampleFilters = {}): Promise<ExampleModel[]> {
    const { status, limit = 20, offset = 0 } = filters;
    return Array.from(this.records.values())
      .filter((r) => !status || (r as unknown as ExampleAttributes).status === status)
      .slice(offset, offset + limit)
      .map((r) => new ExampleModel(r as unknown as Partial<ExampleAttributes>));
  }

  static async findById(id: string | number): Promise<ExampleModel | null> {
    if (!id) return null;
    const record = this.records.get(Number(id));
    return record ? new ExampleModel(record as unknown as Partial<ExampleAttributes>) : null;
  }

  static async create(data: Partial<ExampleAttributes>): Promise<ExampleModel> {
    const example = new ExampleModel(data);
    example.id = Date.now();
    example.createdAt = new Date();
    example.updatedAt = new Date();
    this.records.set(example.id as number, example.toJSON());
    return example;
  }

  static async update(id: string | number, data: Partial<ExampleAttributes>): Promise<ExampleModel | null> {
    const example = await this.findById(id);
    if (!example) return null;
    Object.assign(example, data);
    example.updatedAt = new Date();
    this.records.set(example.id as number, example.toJSON());
    return example;
  }

  static async delete(id: string | number): Promise<boolean> {
    return this.records.delete(Number(id));
  }

  override toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

export default ExampleModel;
