# syntax=docker/dockerfile:1
# Etapa 1: builder — instala deps y compila TS
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Etapa 2: runner — imagen mínima, usuario no root, healthcheck
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
# Usuario no root para seguridad
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
COPY --from=builder /app/package*.json ./
RUN npm ci --only=production && npm cache clean --force
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/db ./src/db
# Healthcheck integrado
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:'+(process.env.PORT||3000)+'/api/v1/live', r=>{process.exit(r.statusCode===200?0:1)}).on('error',()=>process.exit(1))"
USER appuser
EXPOSE 3000
CMD ["node", "dist/index.js"]
