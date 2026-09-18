import { Router } from 'express';
import exampleRoutes from './exampleRoutes';
import authRoutes from './authRoutes';
import { getMetrics } from '../middlewares/metrics';
import { checkDbHealth } from '../config/database';

const router = Router();

router.use('/examples', exampleRoutes);
router.use('/auth', authRoutes);

// Health: estado general
router.get('/health', async (_req, res) => {
  const db = await checkDbHealth();
  res.json({ status: 'ok', timestamp: new Date().toISOString(), uptime: process.uptime(), database: db.status });
});

// Liveness: ¿proceso vivo?
router.get('/live', (_req, res) => {
  res.json({ status: 'alive', timestamp: new Date().toISOString() });
});

// Readiness: ¿listo para tráfico? (DB + dependencias)
router.get('/ready', async (_req, res) => {
  const db = await checkDbHealth();
  const ready = db.status === 'up' || db.status === 'memory';
  res.status(ready ? 200 : 503).json({ status: ready ? 'ready' : 'not_ready', database: db, timestamp: new Date().toISOString() });
});

// Métricas básicas (latencia, errores, uptime)
router.get('/metrics', (_req, res) => {
  res.json({ ...getMetrics(), timestamp: new Date().toISOString() });
});

export default router;
