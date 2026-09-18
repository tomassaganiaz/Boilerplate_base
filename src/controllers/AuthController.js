const { authService } = require('../services/AuthService');
const { successResponse } = require('../utils/response-helpers');

class AuthController {
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      return successResponse(res, result, 'Login successful');
    } catch (err) {
      next(err);
    }
  }
  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.body;
      const result = await authService.refresh(refreshToken);
      return successResponse(res, result, 'Token refreshed');
    } catch (err) {
      next(err);
    }
  }
  async logout(req, res, next) {
    try {
      const { refreshToken } = req.body;
      await authService.logout(refreshToken);
      return successResponse(res, null, 'Logged out');
    } catch (err) {
      next(err);
    }
  }
}

const authController = new AuthController();
module.exports = authController;
module.exports.AuthController = AuthController;
