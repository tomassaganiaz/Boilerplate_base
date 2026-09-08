const express = require('express');
const exampleRoutes = require('./exampleRoutes');

const router = express.Router();

router.use('/examples', exampleRoutes);

router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

module.exports = router;
