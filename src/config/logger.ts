import winston from 'winston';
import config from './index';

// Formato único reutilizable — SRP: solo formateo de logs
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} [${String(level).toUpperCase()}]: ${String(stack || message)}`;
  }),
);

const logger = winston.createLogger({
  level: config.log.level,
  format: logFormat,
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), logFormat),
    }),
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      maxsize: 5242880,
      maxFiles: 5,
    }),
    new winston.transports.File({
      filename: 'logs/combined.log',
      maxsize: 5242880,
      maxFiles: 5,
    }),
  ],
});

// Evita duplicar transporte en dev (ya existe uno en createLogger)
if (config.env === 'development') {
  // Winston deduplica por instancia; no añadimos otro Console aquí para no duplicar
}

export default logger;
