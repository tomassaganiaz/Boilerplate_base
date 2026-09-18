const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');
const { UnauthorizedError } = require('../utils/errors');

const refreshStore = new Map();
const users = new Map([
  [
    'admin@example.com',
    {
      id: '1',
      email: 'admin@example.com',
      passwordHash: bcrypt.hashSync('password123', 10),
      role: 'admin',
    },
  ],
  [
    'user@example.com',
    {
      id: '2',
      email: 'user@example.com',
      passwordHash: bcrypt.hashSync('password123', 10),
      role: 'user',
    },
  ],
]);

class AuthService {
  async login(email, password) {
    const user = users.get(email);
    if (!user) throw new UnauthorizedError('Invalid credentials');
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new UnauthorizedError('Invalid credentials');
    const payload = { id: user.id, role: user.role };
    const refreshSecret =
      config.jwt.refreshSecret || process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret';
    const accessToken = jwt.sign(payload, config.jwt.secret, { expiresIn: config.jwt.expiresIn });
    const refreshToken = jwt.sign(payload, refreshSecret, {
      expiresIn: config.jwt.refreshExpiresIn,
    });
    refreshStore.set(refreshToken, { userId: user.id, role: user.role });
    return { accessToken, refreshToken, user: { id: user.id, email: user.email, role: user.role } };
  }
  async refresh(refreshToken) {
    if (!refreshToken) throw new UnauthorizedError('No refresh token');
    const stored = refreshStore.get(refreshToken);
    if (!stored) throw new UnauthorizedError('Invalid refresh token');
    try {
      const refreshSecret =
        config.jwt.refreshSecret || process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret';
      const decoded = jwt.verify(refreshToken, refreshSecret);
      const accessToken = jwt.sign({ id: decoded.id, role: decoded.role }, config.jwt.secret, {
        expiresIn: config.jwt.expiresIn,
      });
      return { accessToken };
    } catch (err) {
      refreshStore.delete(refreshToken);
      if (err.name === 'TokenExpiredError') throw new UnauthorizedError('Refresh token expired');
      throw new UnauthorizedError('Invalid refresh token');
    }
  }
  async logout(refreshToken) {
    refreshStore.delete(refreshToken);
  }
  clear() {
    refreshStore.clear();
  }
}

const authService = new AuthService();
module.exports = { AuthService, authService };
module.exports.default = authService;
