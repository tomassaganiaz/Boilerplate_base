import config from './index';
import logger from './logger';

// Cliente DB desacoplado — soporta memoria (tests) y Postgres (prod/dev)
// No requiere pg instalado para tests: intenta cargar dinámicamente
let pool: unknown = null;

export interface DbHealth {
  status: 'up' | 'down' | 'memory';
  latencyMs?: number;
  error?: string;
}

export const getPool = async (): Promise<unknown> => {
  if (pool) return pool;
  // En test o si no hay DB configurada, usa memoria
  if (config.env === 'test') return null;
  try {
    // Carga dinámica para no obligar a instalar pg en entornos de test
    // @ts-ignore - pg types opcionales
    const { Pool } = await import('pg');
    const p = new Pool({
      host: config.db.host,
      port: config.db.port,
      database: config.db.name,
      user: config.db.user,
      password: config.db.password,
      max: 10,
      idleTimeoutMillis: 30000,
    });
    pool = p;
    return pool;
  } catch (err) {
    logger.warn(`DB driver not available, using memory store: ${(err as Error).message}`);
    return null;
  }
};

export const checkDbHealth = async (): Promise<DbHealth> => {
  if (config.env === 'test') return { status: 'memory' };
  const start = Date.now();
  try {
    const p = (await getPool()) as unknown as { query?: (sql: string) => Promise<unknown> } | null;
    if (!p || !p.query) return { status: 'memory' };
    await p.query('SELECT 1');
    return { status: 'up', latencyMs: Date.now() - start };
  } catch (err) {
    return { status: 'down', latencyMs: Date.now() - start, error: (err as Error).message };
  }
};

export const disconnectDb = async (): Promise<void> => {
  if (pool && typeof (pool as { end?: () => Promise<void> }).end === 'function') {
    await (pool as { end: () => Promise<void> }).end();
    pool = null;
  }
};
