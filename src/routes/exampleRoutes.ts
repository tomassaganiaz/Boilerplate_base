import { Router } from 'express';
import exampleController from '../controllers/ExampleController';
import { validateBody, validateParams } from '../middlewares/validator';
import { authenticate, optionalAuth, authorize } from '../middlewares/auth';
import { createExampleSchema, updateExampleSchema, idParamSchema, paginationSchema } from '../config/schemas';

const router = Router();

router.get('/', optionalAuth, validateParams(paginationSchema), exampleController.getAll);
router.get('/:id', validateParams(idParamSchema), exampleController.getById);
router.post('/', authenticate, authorize('admin', 'user'), validateBody(createExampleSchema), exampleController.create);
router.put('/:id', authenticate, authorize('admin'), validateParams(idParamSchema), validateBody(updateExampleSchema), exampleController.update);
router.delete('/:id', authenticate, authorize('admin'), validateParams(idParamSchema), exampleController.delete);

export default router;
