# 🚂 Railway Deployment Guide

## 🎯 Deploy Automático via GitHub

### 1. Configuração Inicial
O projeto já está no GitHub: https://github.com/OctaDigital01/Telegram-BOT

### 2. Criar Projeto no Railway
1. Acesse [railway.app](https://railway.app)
2. Faça login com a conta: `contato.octadigital@gmail.com`
3. Clique em **"New Project"**
4. Selecione **"Deploy from GitHub repo"**
5. Escolha o repositório: **OctaDigital01/Telegram-BOT**

### 3. Configurar Serviços

#### 3.1 Banco PostgreSQL
1. No dashboard do projeto, clique **"+ New Service"**
2. Selecione **"Database"** → **"PostgreSQL"**
3. Aguarde a criação (2-3 minutos)
4. Anote a `DATABASE_URL` gerada

#### 3.2 Redis Cache
1. Clique **"+ New Service"**
2. Selecione **"Database"** → **"Redis"**
3. Aguarde a criação (1-2 minutos)
4. Anote a `REDIS_URL` gerada

#### 3.3 Backend Service
1. Clique **"+ New Service"**
2. Selecione **"GitHub Repo"** → **OctaDigital01/Telegram-BOT**
3. **Root Directory**: `backend`
4. **Start Command**: `node dist/server.js`
5. **Build Command**: `npm run build`

**Variáveis de Ambiente do Backend:**
```env
NODE_ENV=production
PORT=$PORT
DATABASE_URL=${{Postgres.DATABASE_URL}}
REDIS_URL=${{Redis.REDIS_URL}}
JWT_SECRET=telegram-bot-manager-super-secret-jwt-key-production-32-chars
JWT_REFRESH_SECRET=telegram-bot-manager-super-secret-refresh-key-production-32-chars
ENCRYPTION_KEY=telegrambotmanager32charkey12345
TELEGRAM_WEBHOOK_DOMAIN=${{RAILWAY_PUBLIC_DOMAIN}}
RATE_LIMIT_WINDOW=60000
RATE_LIMIT_MAX=1000
LOG_LEVEL=info
ENABLE_REGISTRATION=true
ENABLE_SWAGGER=false
```

#### 3.4 Frontend Service
1. Clique **"+ New Service"**
2. Selecione **"GitHub Repo"** → **OctaDigital01/Telegram-BOT**
3. **Root Directory**: `frontend`
4. **Start Command**: `node server.js`
5. **Build Command**: `npm run build`

**Variáveis de Ambiente do Frontend:**
```env
NODE_ENV=production
PORT=$PORT
NEXT_PUBLIC_API_URL=${{Backend.RAILWAY_PUBLIC_DOMAIN}}/api/v1
NEXT_PUBLIC_WS_URL=wss://${{Backend.RAILWAY_PUBLIC_DOMAIN}}
NEXT_PUBLIC_APP_URL=${{RAILWAY_PUBLIC_DOMAIN}}
NEXT_PUBLIC_APP_NAME=TelegramBot Manager
NEXT_PUBLIC_ENABLE_PWA=true
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_TELEMETRY_DISABLED=1
```

### 4. Configurar Domínios

#### 4.1 Backend API
- **Subdomínio sugerido**: `api.telegrambotmanager.up.railway.app`
- **Configuração**: Vá em Backend Service → Settings → Networking → Public Networking → Generate Domain

#### 4.2 Frontend App
- **Domínio customizado sugerido**: `app.telegrambotmanager.com`
- **Configuração**: Vá em Frontend Service → Settings → Networking → Custom Domain

### 5. Health Checks & Monitoring

#### 5.1 Backend Health Check
- **URL**: `/health`
- **Interval**: 30s
- **Timeout**: 10s
- **Expected Response**: `200`

#### 5.2 Frontend Health Check
- **URL**: `/`
- **Interval**: 30s
- **Timeout**: 10s
- **Expected Response**: `200`

### 6. Configuração do Banco de Dados

Após o deploy do backend, execute as migrations:

```bash
# Conectar ao banco via Railway CLI
railway connect Postgres

# Ou executar migrations via service
railway run --service backend npx prisma migrate deploy
railway run --service backend npx prisma db seed
```

### 7. Verificação e Testes

#### 7.1 URLs de Acesso
- **Frontend**: `https://your-frontend-domain.railway.app`
- **Backend API**: `https://your-backend-domain.railway.app/api/v1`
- **Health Check**: `https://your-backend-domain.railway.app/health`

#### 7.2 Testes de Funcionamento
```bash
# Testar health check
curl https://your-backend-domain.railway.app/health

# Testar API
curl https://your-backend-domain.railway.app/api/v1/auth/status

# Testar frontend
curl -I https://your-frontend-domain.railway.app
```

### 8. Configurações de Produção

#### 8.1 Recursos Recomendados
- **Backend**: 1GB RAM, 1 vCPU
- **Frontend**: 512MB RAM, 0.5 vCPU
- **PostgreSQL**: 1GB RAM, 10GB Storage
- **Redis**: 512MB RAM

#### 8.2 Auto-scaling (se necessário)
- **Min replicas**: 1
- **Max replicas**: 5
- **CPU threshold**: 70%
- **Memory threshold**: 80%

### 9. Monitoring & Logs

#### 9.1 Ver Logs
```bash
railway logs --service backend
railway logs --service frontend
```

#### 9.2 Métricas
- CPU Usage
- Memory Usage
- Response Time
- Error Rate
- Database Connections

### 10. Backup & Recovery

#### 10.1 Database Backup
```bash
# Backup automático diário (Railway Pro)
# Backup manual
railway connect Postgres
pg_dump $DATABASE_URL > backup.sql
```

#### 10.2 Rollback
```bash
# Voltar para deployment anterior
railway rollback --service backend
railway rollback --service frontend
```

## 🎛️ Comandos Úteis

```bash
# Status dos serviços
railway status

# Variáveis de ambiente
railway variables

# Conectar ao banco
railway connect Postgres

# Shell do Redis
railway connect Redis

# Restart serviços
railway restart --service backend
railway restart --service frontend

# Deploy manual
railway up --service backend
railway up --service frontend
```

## 🚨 Troubleshooting

### Problemas Comuns

#### 1. Build falha
- Verificar `package.json` e dependências
- Checar variáveis de ambiente
- Ver logs de build: `railway logs --build`

#### 2. Database connection error
- Verificar `DATABASE_URL`
- Confirmar migrations executadas
- Testar conexão: `railway connect Postgres`

#### 3. Frontend não carrega
- Verificar `NEXT_PUBLIC_API_URL`
- Checar build do Next.js
- Confirmar porta configurada

#### 4. 502 Bad Gateway
- Verificar se backend está rodando
- Confirmar health check
- Verificar logs: `railway logs --service backend`

### Logs Importantes

#### Backend
```bash
railway logs --service backend --tail
```

#### Frontend
```bash
railway logs --service frontend --tail
```

#### Database
```bash
railway logs --service Postgres
```

## 📊 Custos Estimados

### Plano Hobby (Gratuito)
- $5 crédito mensal
- Suficiente para testes
- Sleep após inatividade

### Plano Pro ($20/mês)
- $20 crédito + recursos extras
- Sem sleep
- Domínios customizados
- Backups automáticos
- Suporte prioritário

## 🎉 Deploy Pronto!

Após seguir este guia, sua aplicação estará funcionando em produção com:

✅ **Backend API** funcionando  
✅ **Frontend App** responsivo  
✅ **PostgreSQL** com dados  
✅ **Redis** para cache  
✅ **Domínios** configurados  
✅ **SSL** automático  
✅ **Monitoring** ativo  
✅ **Logs** centralizados  

**Sua aplicação SaaS está no ar! 🚀**