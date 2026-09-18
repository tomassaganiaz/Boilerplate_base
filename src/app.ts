import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import config from './config';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler';
import { apiLimiter } from './middlewares/rateLimiter';
import requestLogger from './middlewares/requestLogger';

const app = express();

// Middlewares globales — orden importa: seguridad → parsing → logging → rate-limit
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json({ limit: config.http.bodyLimit }));
app.use(express.urlencoded({ extended: true, limit: config.http.bodyLimit }));

if (config.env !== 'test') app.use(requestLogger);

app.use(apiLimiter);
app.use('/api/v1', routes);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
