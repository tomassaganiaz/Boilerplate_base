const config = require('./config');
const logger = require('./config/logger');
const app = require('./app');

const PORT = config.port;

const server = app.listen(config.port, () => {
  logger.info(`Server running on port ${PORT} in ${config.env} mode`);
});

const gracefulShutdown = (signal) => {
  logger.info(`${signal} received, shutting down gracefully`);
  server.close(() => {
    logger.info('Process terminated');
    process.exit(0);
  });
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

module.exports = app;
