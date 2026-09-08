const express = require('express');
const router = express.Router();
const exampleController = require('../controllers/ExampleController');
const { validateBody, validateParams } = require('../middlewares/validator');
const { authenticate, optionalAuth, authorize } = require('../middlewares/auth');
const { createExampleSchema, updateExampleSchema, idParamSchema, paginationSchema } = require('../config/schemas');

router.get('/',
  optionalAuth,
  validateParams(paginationSchema),
  exampleController.getAll
);

router.get('/:id',
  validateParams(idParamSchema),
  exampleController.getById
);

router.post('/',
  authenticate,
  authorize('admin', 'user'),
  validateBody(createExampleSchema),
  exampleController.create
);

router.put('/:id',
  authenticate,
  authorize('admin'),
  validateParams(idParamSchema),
  validateBody(updateExampleSchema),
  exampleController.update
);

router.delete('/:id',
  authenticate,
  authorize('admin'),
  validateParams(idParamSchema),
  exampleController.delete
);

module.exports = router;
