# 🚀 Deployment Guide

## Visão Geral

Este guia detalha o processo completo de deployment do TelegramBot Manager no Railway, incluindo configuração de containers, variáveis de ambiente e CI/CD.

## 📦 Pré-requisitos

- Conta no [Railway](https://railway.app)
- Conta no [GitHub](https://github.com)
- Docker instalado localmente
- Node.js 18+ 
- PostgreSQL 14+
- Redis 6+

## 🐳 Docker Configuration

### Backend Dockerfile

```dockerfile
# backend/Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./
COPY prisma ./prisma/

# Instalar dependências
RUN npm ci --only=production
RUN npx prisma generate

# Copiar código fonte
COPY . .

# Build da aplicação
RUN npm run build

# Estágio de produção
FROM node:18-alpine

WORKDIR /app

# Instalar dumb-init para melhor handling de sinais
RUN apk add --no-cache dumb-init

# Criar usuário não-root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Copiar arquivos do builder
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nodejs:nodejs /app/package*.json ./

# Mudar para usuário não-root
USER nodejs

# Expor porta
EXPOSE 3333

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js

# Comando de inicialização
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/server.js"]
```

### Frontend Dockerfile

```dockerfile
# frontend/Dockerfile
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  postgres:
    image: postgres:14-alpine
    environment:
      POSTGRES_USER: telegram_user
      POSTGRES_PASSWORD: telegram_pass
      POSTGRES_DB: telegram_bot_saas
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U telegram_user"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:6-alpine
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    environment:
      DATABASE_URL: postgresql://telegram_user:telegram_pass@postgres:5432/telegram_bot_saas
      REDIS_URL: redis://redis:6379
      NODE_ENV: production
    ports:
      - "3333:3333"
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    restart: unless-stopped

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    environment:
      NEXT_PUBLIC_API_URL: http://backend:3333
      NEXT_PUBLIC_WS_URL: ws://backend:3333
    ports:
      - "3000:3000"
    depends_on:
      - backend
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
```

## 🚂 Railway Configuration

### railway.toml

```toml
# railway.toml (raiz do projeto)
[build]
  builder = "DOCKERFILE"
  watchPatterns = ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"]

[deploy]
  healthcheckPath = "/health"
  healthcheckTimeout = 300
  restartPolicyType = "ON_FAILURE"
  restartPolicyMaxRetries = 3

# Backend Service
[[services]]
  name = "backend"
  root = "backend"
  
  [services.build]
    dockerfile = "Dockerfile"
  
  [services.deploy]
    startCommand = "node dist/server.js"
    port = 3333
    
  [[services.healthcheck]]
    path = "/health"
    interval = 30
    timeout = 10

# Frontend Service  
[[services]]
  name = "frontend"
  root = "frontend"
  
  [services.build]
    dockerfile = "Dockerfile"
    
  [services.deploy]
    startCommand = "node server.js"
    port = 3000
    
  [[services.healthcheck]]
    path = "/"
    interval = 30
    timeout = 10
```

### Railway CLI Setup

```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login
railway login

# Inicializar projeto
railway init

# Link com projeto existente
railway link [project-id]

# Deploy
railway up
```

## 🔐 Variáveis de Ambiente

### Backend (.env.production)

```env
# Banco de Dados
DATABASE_URL=postgresql://user:pass@host:5432/telegram_bot_saas

# Redis
REDIS_URL=redis://host:6379

# Aplicação
NODE_ENV=production
PORT=3333
API_URL=https://api.telegrambotmanager.com

# Segurança
JWT_SECRET=super-secret-jwt-key-change-this
JWT_REFRESH_SECRET=super-secret-refresh-key-change-this
ENCRYPTION_KEY=32-character-encryption-key-here

# Telegram
TELEGRAM_WEBHOOK_DOMAIN=https://api.telegrambotmanager.com

# Pagamento
MERCADOPAGO_ACCESS_TOKEN=TEST-xxxx
MERCADOPAGO_PUBLIC_KEY=TEST-xxxx
STRIPE_SECRET_KEY=sk_test_xxxx
STRIPE_PUBLIC_KEY=pk_test_xxxx

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noreply@telegrambotmanager.com
SMTP_PASS=password

# Monitoring
SENTRY_DSN=https://xxxx@sentry.io/xxxx
DATADOG_API_KEY=xxxx
NEW_RELIC_LICENSE_KEY=xxxx

# Storage
AWS_ACCESS_KEY_ID=xxxx
AWS_SECRET_ACCESS_KEY=xxxx
AWS_REGION=us-east-1
S3_BUCKET=telegram-bot-manager

# Rate Limiting
RATE_LIMIT_WINDOW=60000
RATE_LIMIT_MAX=100
```

### Frontend (.env.production)

```env
# API
NEXT_PUBLIC_API_URL=https://api.telegrambotmanager.com
NEXT_PUBLIC_WS_URL=wss://api.telegrambotmanager.com

# App
NEXT_PUBLIC_APP_URL=https://app.telegrambotmanager.com
NEXT_PUBLIC_APP_NAME=TelegramBot Manager

# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_HOTJAR_ID=xxxxxxx
NEXT_PUBLIC_MIXPANEL_TOKEN=xxxx

# Features
NEXT_PUBLIC_ENABLE_PWA=true
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_SENTRY=true

# Sentry
NEXT_PUBLIC_SENTRY_DSN=https://xxxx@sentry.io/xxxx
SENTRY_AUTH_TOKEN=xxxx
```

## 🔄 CI/CD Pipeline

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to Railway

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:14
        env:
          POSTGRES_PASSWORD: test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
          
      redis:
        image: redis:6
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 6379:6379
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: |
          cd backend && npm ci
          cd ../frontend && npm ci
      
      - name: Run backend tests
        env:
          DATABASE_URL: postgresql://postgres:test@localhost:5432/test
          REDIS_URL: redis://localhost:6379
        run: |
          cd backend
          npx prisma migrate deploy
          npm run test
          npm run test:e2e
      
      - name: Run frontend tests
        run: |
          cd frontend
          npm run test
          npm run test:e2e
      
      - name: Build
        run: |
          cd backend && npm run build
          cd ../frontend && npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Install Railway CLI
        run: npm install -g @railway/cli
      
      - name: Deploy to Railway
        run: |
          railway up --service backend
          railway up --service frontend
```

## 📊 Monitoring

### Health Check Endpoint

```typescript
// backend/src/api/health/health.controller.ts
import { Request, Response } from 'express'
import { prisma } from '../../lib/prisma'
import { redis } from '../../lib/redis'

export async function healthCheck(req: Request, res: Response) {
  const checks = {
    server: 'ok',
    database: 'checking',
    redis: 'checking',
    timestamp: new Date().toISOString()
  }

  try {
    // Check database
    await prisma.$queryRaw`SELECT 1`
    checks.database = 'ok'
  } catch (error) {
    checks.database = 'error'
  }

  try {
    // Check Redis
    await redis.ping()
    checks.redis = 'ok'
  } catch (error) {
    checks.redis = 'error'
  }

  const isHealthy = Object.values(checks).every(
    status => status === 'ok' || status === checks.timestamp
  )

  res.status(isHealthy ? 200 : 503).json(checks)
}
```

### Logging

```typescript
// backend/src/lib/logger.ts
import winston from 'winston'
import { Logtail } from '@logtail/node'
import { LogtailTransport } from '@logtail/winston'

const logtail = new Logtail(process.env.LOGTAIL_TOKEN!)

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({
      format: winston.format.simple()
    }),
    new LogtailTransport(logtail)
  ]
})
```

## 🚨 Rollback Strategy

### Automatic Rollback

```yaml
# railway.toml
[deploy]
  healthcheckPath = "/health"
  healthcheckTimeout = 300
  restartPolicyType = "ON_FAILURE"
  restartPolicyMaxRetries = 3
  
  # Rollback automático se health check falhar
  [deploy.rollback]
    enabled = true
    maxRetries = 2
    onHealthcheckFailure = true
```

### Manual Rollback

```bash
# Listar deployments
railway deployments

# Rollback para deployment anterior
railway rollback [deployment-id]

# Ou via interface web
# https://railway.app/project/[project-id]/deployments
```

## 📈 Scaling

### Horizontal Scaling

```bash
# Escalar serviço
railway scale backend --replicas 3
railway scale frontend --replicas 2

# Auto-scaling baseado em CPU
railway autoscale backend \
  --min 1 \
  --max 10 \
  --cpu-threshold 70
```

### Vertical Scaling

```bash
# Aumentar recursos
railway resource backend \
  --memory 2GB \
  --cpu 2

railway resource postgres \
  --memory 4GB \
  --storage 100GB
```

## 🔒 Security

### SSL/TLS

Railway fornece SSL automaticamente. Para domínio customizado:

```bash
# Adicionar domínio customizado
railway domain add app.telegrambotmanager.com --service frontend
railway domain add api.telegrambotmanager.com --service backend
```

### Secrets Management

```bash
# Adicionar secrets via CLI
railway variables set JWT_SECRET="super-secret" --service backend

# Ou via arquivo
railway variables set --file .env.production --service backend
```

### Network Security

```yaml
# railway.toml
[network]
  # Apenas permitir tráfego interno entre serviços
  internalOnly = false
  
  # Configurar CORS
  [network.cors]
    origins = ["https://app.telegrambotmanager.com"]
    methods = ["GET", "POST", "PUT", "DELETE"]
    credentials = true
```

## 🎯 Performance Optimization

### CDN Configuration

```nginx
# Cloudflare Page Rules
*.telegrambotmanager.com/*
- Cache Level: Standard
- Edge Cache TTL: 1 month
- Browser Cache TTL: 4 hours
```

### Database Optimization

```sql
-- Índices importantes
CREATE INDEX idx_bots_user_id ON bots(user_id);
CREATE INDEX idx_flows_bot_id ON flows(bot_id);
CREATE INDEX idx_messages_flow_id ON messages(flow_id);
CREATE INDEX idx_conversations_bot_user ON conversations(bot_id, telegram_user_id);

-- Vacuum e Analyze automático
ALTER DATABASE telegram_bot_saas SET autovacuum = on;
```

### Redis Configuration

```conf
# redis.conf
maxmemory 2gb
maxmemory-policy allkeys-lru
save 900 1
save 300 10
save 60 10000
```

## 📱 Mobile Optimization

### PWA Configuration

```json
// frontend/public/manifest.json
{
  "name": "TelegramBot Manager",
  "short_name": "TBM",
  "theme_color": "#000000",
  "background_color": "#000000",
  "display": "standalone",
  "scope": "/",
  "start_url": "/",
  "icons": [
    {
      "src": "icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

## 🧪 Testing in Production

### Smoke Tests

```typescript
// tests/smoke.test.ts
describe('Smoke Tests', () => {
  it('should respond to health check', async () => {
    const response = await fetch('https://api.telegrambotmanager.com/health')
    expect(response.status).toBe(200)
  })

  it('should load frontend', async () => {
    const response = await fetch('https://app.telegrambotmanager.com')
    expect(response.status).toBe(200)
  })
})
```

### Load Testing

```bash
# Usando k6
k6 run --vus 100 --duration 30s tests/load.js
```

## 📞 Support & Troubleshooting

### Logs

```bash
# Ver logs em tempo real
railway logs --service backend --tail

# Baixar logs
railway logs --service backend --download
```

### Debug Mode

```bash
# Ativar debug mode
railway variables set DEBUG="*" --service backend
railway restart backend
```

### Common Issues

| Problema | Solução |
|----------|---------|
| Build falha | Verificar Dockerfile e dependências |
| Database connection error | Verificar DATABASE_URL e firewall |
| High memory usage | Aumentar recursos ou otimizar código |
| Slow response | Verificar índices do banco e cache |

## 📚 Resources

- [Railway Documentation](https://docs.railway.app)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Node.js Production Guide](https://nodejs.org/en/docs/guides/)
- [PostgreSQL Optimization](https://wiki.postgresql.org/wiki/Performance_Optimization)