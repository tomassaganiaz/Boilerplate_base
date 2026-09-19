import { Router } from 'express';
import { authController } from '../controllers/AuthController';
import { validateBody } from '../middlewares/validator';
import { authLimiter } from '../middlewares/rateLimiter';
import Joi from 'joi';

const router = Router();

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const refreshSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

// Login con rate limit específico para mitigar brute force
router.post('/login', authLimiter, validateBody(loginSchema), (req, res, next) => authController.login(req, res, next));
router.post('/refresh', validateBody(refreshSchema), (req, res, next) => authController.refresh(req, res, next));
router.post('/logout', validateBody(refreshSchema), (req, res, next) => authController.logout(req, res, next));

export default router;
