import type { Server } from 'http';
import app from './app';
import config from './config';
import logger from './config/logger';
import { disconnectDb } from './config/database';

// SRP: solo orquesta arranque y apagado; app.ts exporta solo Express sin side-effects
export const startServer = (port: number = config.port): Server => {
  const server = app.listen(port, () => {
    logger.info(`Server running on port ${port} in ${config.env} mode`);
  });

  // Manejo de errores de arranque (puerto en uso, etc.)
  server.on('error', (err: NodeJS.ErrnoException) => {
    logger.error(`Failed to start server: ${err.message}`);
    process.exit(1);
  });

  return server;
};

export const gracefulShutdown = async (server: Server, signal: string): Promise<void> => {
  logger.info(`${signal} received, shutting down gracefully`);
  await disconnectDb();
  await new Promise<void>((resolve) => {
    server.close(() => {
      logger.info('Process terminated');
      resolve();
    });
  });
};

export default startServer;
