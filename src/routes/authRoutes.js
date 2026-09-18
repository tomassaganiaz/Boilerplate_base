const express = require('express');
const router = express.Router();
const authController = require('../controllers/AuthController');
const { validateBody } = require('../middlewares/validator');
const { authLimiter } = require('../middlewares/rateLimiter');
const Joi = require('joi');

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const refreshSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

router.post('/login', authLimiter, validateBody(loginSchema), (req, res, next) =>
  authController.login(req, res, next)
);
router.post('/refresh', validateBody(refreshSchema), (req, res, next) =>
  authController.refresh(req, res, next)
);
router.post('/logout', validateBody(refreshSchema), (req, res, next) =>
  authController.logout(req, res, next)
);

module.exports = router;
