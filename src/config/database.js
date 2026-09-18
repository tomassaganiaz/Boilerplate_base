const config = require('./index');
const logger = require('./logger');
let pool = null;

const getPool = async () => {
  if (pool) return pool;
  if (config.env === 'test') return null;
  try {
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
    logger.warn(`DB driver not available, using memory store: ${err.message}`);
    return null;
  }
};

const checkDbHealth = async () => {
  if (config.env === 'test') return { status: 'memory' };
  const start = Date.now();
  try {
    const p = await getPool();
    if (!p || !p.query) return { status: 'memory' };
    await p.query('SELECT 1');
    return { status: 'up', latencyMs: Date.now() - start };
  } catch (err) {
    return { status: 'down', latencyMs: Date.now() - start, error: err.message };
  }
};

const disconnectDb = async () => {
  if (pool && typeof pool.end === 'function') {
    await pool.end();
    pool = null;
  }
};

module.exports = { getPool, checkDbHealth, disconnectDb };
