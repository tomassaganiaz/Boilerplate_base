import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../config';
import { UnauthorizedError } from '../utils/errors';
import type { JwtPayload } from '../types';

// Store en memoria para refresh tokens — en prod usar Redis/DB
const refreshStore = new Map<string, { userId: string; role: string }>();
// Usuarios demo (password: "password123" bcrypt)
const users = new Map<string, { id: string; email: string; passwordHash: string; role: string }>([
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

export interface LoginResult {
  accessToken: string;
  refreshToken: string;
  user: { id: string; email: string; role: string };
}

export class AuthService {
  // SRP: solo lógica de auth, DIP: depende de config abstraída
  async login(email: string, password: string): Promise<LoginResult> {
    const user = users.get(email);
    if (!user) throw new UnauthorizedError('Invalid credentials');
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new UnauthorizedError('Invalid credentials');

    const payload: JwtPayload = { id: user.id, role: user.role };
    const refreshSecret =
      config.jwt.refreshSecret || process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret';
    const accessToken = jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    } as unknown as jwt.SignOptions);
    const refreshToken = jwt.sign(payload, refreshSecret, {
      expiresIn: config.jwt.refreshExpiresIn,
    } as unknown as jwt.SignOptions);

    refreshStore.set(refreshToken, { userId: user.id, role: user.role });

    return { accessToken, refreshToken, user: { id: user.id, email: user.email, role: user.role } };
  }

  async refresh(refreshToken: string): Promise<{ accessToken: string }> {
    if (!refreshToken) throw new UnauthorizedError('No refresh token');
    const stored = refreshStore.get(refreshToken);
    if (!stored) throw new UnauthorizedError('Invalid refresh token');
    try {
      const decoded = jwt.verify(
        refreshToken,
        config.jwt.refreshSecret || process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret'
      ) as JwtPayload;
      const accessToken = jwt.sign({ id: decoded.id, role: decoded.role }, config.jwt.secret, {
        expiresIn: config.jwt.expiresIn,
      } as unknown as jwt.SignOptions);
      return { accessToken };
    } catch (err) {
      refreshStore.delete(refreshToken);
      if ((err as { name?: string }).name === 'TokenExpiredError')
        throw new UnauthorizedError('Refresh token expired');
      throw new UnauthorizedError('Invalid refresh token');
    }
  }

  async logout(refreshToken: string): Promise<void> {
    refreshStore.delete(refreshToken);
  }

  // Para tests
  clear(): void {
    refreshStore.clear();
  }
}

export const authService = new AuthService();
export default authService;
