import { Router } from 'express';
import exampleRoutes from './exampleRoutes';

const router = Router();

router.use('/examples', exampleRoutes);

router.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
