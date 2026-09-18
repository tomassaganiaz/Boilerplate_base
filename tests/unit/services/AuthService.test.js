const { AuthService } = require('../../../src/services/AuthService');

describe('AuthService', () => {
  let service;
  beforeEach(() => {
    service = new AuthService();
    service.clear();
  });

  describe('login', () => {
    it('should login with valid admin credentials', async () => {
      const result = await service.login('admin@example.com', 'password123');
      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
      expect(result.user.role).toBe('admin');
    });
    it('should throw for invalid email', async () => {
      await expect(service.login('no@ex.com', 'password123')).rejects.toThrow(
        'Invalid credentials'
      );
    });
    it('should throw for invalid password', async () => {
      await expect(service.login('admin@example.com', 'wrong')).rejects.toThrow(
        'Invalid credentials'
      );
    });
  });

  describe('refresh', () => {
    it('should refresh with valid token', async () => {
      const { refreshToken } = await service.login('user@example.com', 'password123');
      const result = await service.refresh(refreshToken);
      expect(result.accessToken).toBeDefined();
    });
    it('should throw for missing token', async () => {
      await expect(service.refresh('')).rejects.toThrow('No refresh token');
    });
    it('should throw for invalid token', async () => {
      await expect(service.refresh('invalid')).rejects.toThrow('Invalid refresh token');
    });
  });

  describe('logout', () => {
    it('should revoke refresh token', async () => {
      const { refreshToken } = await service.login('admin@example.com', 'password123');
      await service.logout(refreshToken);
      await expect(service.refresh(refreshToken)).rejects.toThrow('Invalid refresh token');
    });
  });
});
