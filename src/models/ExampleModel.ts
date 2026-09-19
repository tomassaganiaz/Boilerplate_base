import { BaseModel, type BaseEntity } from './BaseModel';
import { getPool } from '../config/database';
import logger from '../config/logger';

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

// Helper para mapear fila DB (snake_case) a atributos
const mapRow = (row: Record<string, unknown>): Partial<ExampleAttributes> => ({
  id: row.id as number,
  name: row.name as string,
  description: (row.description as string) ?? '',
  status: row.status as 'active' | 'inactive',
  createdAt: row.created_at as Date,
  updatedAt: row.updated_at as Date,
});

// Modelo con persistencia dual — intenta Postgres, fallback a memoria (tests)
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
    // Intenta DB primero
    try {
      const pool = (await getPool()) as unknown as {
        query: (sql: string, params: unknown[]) => Promise<{ rows: Record<string, unknown>[] }>;
      } | null;
      if (pool?.query) {
        const params: unknown[] = [];
        let where = '';
        if (status) {
          params.push(status);
          where = `WHERE status = $${params.length}`;
        }
        params.push(limit, offset);
        const sql = `SELECT * FROM examples ${where} ORDER BY id DESC LIMIT $${params.length - 1} OFFSET $${params.length}`;
        const res = await pool.query(sql, params);
        return res.rows.map((r) => new ExampleModel(mapRow(r)));
      }
    } catch (err) {
      logger.warn(`DB findAll fallback to memory: ${(err as Error).message}`);
    }
    // Fallback memoria
    return Array.from(this.records.values())
      .filter((r) => !status || (r as unknown as ExampleAttributes).status === status)
      .slice(offset, offset + limit)
      .map((r) => new ExampleModel(r as unknown as Partial<ExampleAttributes>));
  }

  static async findById(id: string | number): Promise<ExampleModel | null> {
    if (!id) return null;
    try {
      const pool = (await getPool()) as unknown as {
        query: (sql: string, params: unknown[]) => Promise<{ rows: Record<string, unknown>[] }>;
      } | null;
      if (pool?.query) {
        const res = await pool.query('SELECT * FROM examples WHERE id = $1', [Number(id)]);
        if (res.rows[0]) return new ExampleModel(mapRow(res.rows[0]));
      }
    } catch (err) {
      logger.warn(`DB findById fallback: ${(err as Error).message}`);
    }
    const record = this.records.get(Number(id));
    return record ? new ExampleModel(record as unknown as Partial<ExampleAttributes>) : null;
  }

  static async create(data: Partial<ExampleAttributes>): Promise<ExampleModel> {
    try {
      const pool = (await getPool()) as unknown as {
        query: (sql: string, params: unknown[]) => Promise<{ rows: Record<string, unknown>[] }>;
      } | null;
      if (pool?.query) {
        const res = await pool.query(
          'INSERT INTO examples (name, description, status) VALUES ($1,$2,$3) RETURNING *',
          [data.name ?? '', data.description ?? '', data.status ?? 'active']
        );
        return new ExampleModel(mapRow(res.rows[0]));
      }
    } catch (err) {
      logger.warn(`DB create fallback: ${(err as Error).message}`);
    }
    const example = new ExampleModel(data);
    example.id = Date.now();
    example.createdAt = new Date();
    example.updatedAt = new Date();
    this.records.set(example.id as number, example.toJSON());
    return example;
  }

  static async update(
    id: string | number,
    data: Partial<ExampleAttributes>
  ): Promise<ExampleModel | null> {
    try {
      const pool = (await getPool()) as unknown as {
        query: (sql: string, params: unknown[]) => Promise<{ rows: Record<string, unknown>[] }>;
      } | null;
      if (pool?.query) {
        const fields: string[] = [];
        const params: unknown[] = [];
        if (data.name !== undefined) {
          params.push(data.name);
          fields.push(`name = $${params.length}`);
        }
        if (data.description !== undefined) {
          params.push(data.description);
          fields.push(`description = $${params.length}`);
        }
        if (data.status !== undefined) {
          params.push(data.status);
          fields.push(`status = $${params.length}`);
        }
        if (fields.length === 0) return this.findById(id);
        fields.push(`updated_at = NOW()`);
        params.push(Number(id));
        const sql = `UPDATE examples SET ${fields.join(', ')} WHERE id = $${params.length} RETURNING *`;
        const res = await pool.query(sql, params);
        if (res.rows[0]) return new ExampleModel(mapRow(res.rows[0]));
        return null;
      }
    } catch (err) {
      logger.warn(`DB update fallback: ${(err as Error).message}`);
    }
    const example = await this.findById(id);
    if (!example) return null;
    Object.assign(example, data);
    example.updatedAt = new Date();
    this.records.set(example.id as number, example.toJSON());
    return example;
  }

  static async delete(id: string | number): Promise<boolean> {
    try {
      const pool = (await getPool()) as unknown as {
        query: (sql: string, params: unknown[]) => Promise<{ rowCount: number }>;
      } | null;
      if (pool?.query) {
        const res = await pool.query('DELETE FROM examples WHERE id = $1', [Number(id)]);
        return (res.rowCount ?? 0) > 0;
      }
    } catch (err) {
      logger.warn(`DB delete fallback: ${(err as Error).message}`);
    }
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
