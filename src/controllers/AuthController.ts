import type { Request, Response, NextFunction } from 'express';
import { authService } from '../services/AuthService';
import { successResponse } from '../utils/response-helpers';

export class AuthController {
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body as { email: string; password: string };
      const result = await authService.login(email, password);
      successResponse(res, result, 'Login successful');
    } catch (err) {
      next(err);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refreshToken } = req.body as { refreshToken: string };
      const result = await authService.refresh(refreshToken);
      successResponse(res, result, 'Token refreshed');
    } catch (err) {
      next(err);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refreshToken } = req.body as { refreshToken: string };
      await authService.logout(refreshToken);
      successResponse(res, null, 'Logged out');
    } catch (err) {
      next(err);
    }
  }
}

export const authController = new AuthController();
export default authController;
