const express = require('express');
const exampleRoutes = require('./exampleRoutes');
const authRoutes = require('./authRoutes');
const { getMetrics } = require('../middlewares/metrics');
const { checkDbHealth } = require('../config/database');

const router = express.Router();

router.use('/examples', exampleRoutes);
router.use('/auth', authRoutes);

router.get('/health', async (req, res) => {
  const db = await checkDbHealth();
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: db.status,
  });
});

router.get('/live', (req, res) => {
  res.json({ status: 'alive', timestamp: new Date().toISOString() });
});

router.get('/ready', async (req, res) => {
  const db = await checkDbHealth();
  const ready = db.status === 'up' || db.status === 'memory';
  res
    .status(ready ? 200 : 503)
    .json({
      status: ready ? 'ready' : 'not_ready',
      database: db,
      timestamp: new Date().toISOString(),
    });
});

router.get('/metrics', (req, res) => {
  res.json({ ...getMetrics(), timestamp: new Date().toISOString() });
});

module.exports = router;
