import fs from 'fs';
import path from 'path';

(async () => {
  const { getPool } = await import('../dist/config/database.js').catch(() => ({ getPool: async () => null as unknown as null }));
  const pool = (await (getPool as () => Promise<any>)()) as any;
  if (!pool) {
    console.log('DB not configured, skipping migration (memory mode)');
    process.exit(0);
  }
  const dir = path.join(__dirname, '..', 'src', 'db', 'migrations');
  const files = fs.readdirSync(dir).sort();
  for (const f of files) {
    const sql = fs.readFileSync(path.join(dir, f), 'utf8');
    console.log(`Running ${f}...`);
    await pool.query(sql);
  }
  console.log('Migrations done');
  process.exit(0);
})();
