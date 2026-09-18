// Tipos centrales del dominio — ISP: interfaces pequeñas y específicas

export interface PaginationParams {
  page: number;
  limit: number;
  offset: number;
  sort?: 'asc' | 'desc';
  status?: string;
}

export interface PaginatedMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface ApiSuccessResponse<T> {
  success: true;
  message: string;
  data: T;
  meta?: PaginatedMeta;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
    stack?: string;
  };
}

// ISP: segregación en interfaces de lectura/escritura para cumplir SOLID
export interface IReadable<T, F = Record<string, unknown>> {
  findAll(filters?: F): Promise<T[]>;
  findById(id: string | number): Promise<T | null>;
}

export interface IWritable<T> {
  create(data: Partial<T>): Promise<T>;
  update(id: string | number, data: Partial<T>): Promise<T | null>;
  delete(id: string | number): Promise<boolean>;
}

export interface IRepository<T, F = Record<string, unknown>>
  extends IReadable<T, F>,
    IWritable<T> {}

export interface IService<T, F = Record<string, unknown>> {
  getAll(filters?: F): Promise<T[]>;
  getById(id: string | number): Promise<T | null>;
  create(data: Partial<T>): Promise<T>;
  update(id: string | number, data: Partial<T>): Promise<T | null>;
  delete(id: string | number): Promise<boolean>;
}

export interface JwtPayload {
  id: string | number;
  role?: string;
  iat?: number;
  exp?: number;
}

export interface AppConfig {
  env: 'development' | 'test' | 'production';
  port: number;
  db: { host: string; port: number; name: string; user: string; password: string };
  jwt: { secret: string; expiresIn: string };
  log: { level: string };
  rateLimit: { windowMs: number; max: number };
  http: { bodyLimit: string };
  pagination: { defaultLimit: number; maxLimit: number };
}
