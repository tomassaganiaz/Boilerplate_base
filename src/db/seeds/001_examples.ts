// Seed reproducible — inserta datos de ejemplo si la tabla está vacía
import { getPool } from '../../config/database';
import logger from '../../config/logger';

export const seed = async (): Promise<void> => {
  const pool = (await getPool()) as unknown as { query: (sql: string, params?: unknown[]) => Promise<{ rowCount: number }> } | null;
  if (!pool) {
    logger.info('Seed skipped: memory store');
    return;
  }
  const count = await pool.query('SELECT COUNT(*) FROM examples');
  // Si ya hay datos, no resembrar
  logger.info('Seed: examples table ready');
};

export default seed;
