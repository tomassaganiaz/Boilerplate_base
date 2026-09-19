import config from './config';
import app from './app';
import { startServer, gracefulShutdown } from './server';

// Punto de entrada — delega a startServer para permitir tests sin side-effects
const server = startServer(config.port);

process.on('SIGTERM', async () => {
  await gracefulShutdown(server, 'SIGTERM');
  process.exit(0);
});
process.on('SIGINT', async () => {
  await gracefulShutdown(server, 'SIGINT');
  process.exit(0);
});

export default app;
