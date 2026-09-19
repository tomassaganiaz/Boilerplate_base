import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import config from './config';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler';
import { apiLimiter } from './middlewares/rateLimiter';
import requestLogger from './middlewares/requestLogger';
import requestId from './middlewares/requestId';
import { metricsMiddleware } from './middlewares/metrics';

const app = express();

// Middlewares globales — orden: requestId → seguridad → parsing → métricas → logging → rate-limit
app.use(requestId);
app.use(helmet());
// CORS por lista blanca — si CORS_ORIGIN=* permite todo, si no solo orígenes listados
const allowedOrigins = config.http.corsOrigin === '*' ? '*' : config.http.corsOrigin.split(',').map((o) => o.trim());
app.use(
  cors({
    origin: allowedOrigins === '*' ? true : (allowedOrigins as string[]),
    credentials: true,
  }),
);
app.use(compression());
app.use(express.json({ limit: config.http.bodyLimit }));
app.use(express.urlencoded({ extended: true, limit: config.http.bodyLimit }));

app.use(metricsMiddleware);
if (config.env !== 'test') app.use(requestLogger);

app.use(apiLimiter);
app.use('/api/v1', routes);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
