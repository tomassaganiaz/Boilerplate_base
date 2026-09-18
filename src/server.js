const app = require('./app');
const config = require('./config');
const logger = require('./config/logger');
const { disconnectDb } = require('./config/database');

const startServer = (port = config.port) => {
  const server = app.listen(port, () => {
    logger.info(`Server running on port ${port} in ${config.env} mode`);
  });
  server.on('error', (err) => {
    logger.error(`Failed to start server: ${err.message}`);
    process.exit(1);
  });
  return server;
};

const gracefulShutdown = async (server, signal) => {
  logger.info(`${signal} received, shutting down gracefully`);
  await disconnectDb();
  await new Promise((resolve) => {
    server.close(() => {
      logger.info('Process terminated');
      resolve();
    });
  });
};

module.exports = { startServer, gracefulShutdown };
