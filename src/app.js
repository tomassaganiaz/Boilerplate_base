const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');

const config = require('./config');
const routes = require('./routes');
const { errorHandler, notFoundHandler } = require('./middlewares/errorHandler');
const { apiLimiter } = require('./middlewares/rateLimiter');
const requestLogger = require('./middlewares/requestLogger');
const requestId = require('./middlewares/requestId');
const { metricsMiddleware } = require('./middlewares/metrics');

const app = express();

app.use(requestId);
app.use(helmet());
const allowedOrigins =
  config.http.corsOrigin === '*' ? '*' : config.http.corsOrigin.split(',').map((o) => o.trim());
app.use(cors({ origin: allowedOrigins === '*' ? true : allowedOrigins, credentials: true }));
app.use(compression());
app.use(express.json({ limit: config.http.bodyLimit }));
app.use(express.urlencoded({ extended: true, limit: config.http.bodyLimit }));

app.use(metricsMiddleware);
if (config.env !== 'test') {
  app.use(requestLogger);
}

app.use(apiLimiter);
app.use('/api/v1', routes);
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
