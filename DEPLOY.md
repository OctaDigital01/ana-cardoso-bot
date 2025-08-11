# 🚀 Guia de Deploy - Ana Cardoso Bot SaaS

Este guia explica como fazer o deploy completo da aplicação para produção.

## 📋 Pré-requisitos

- [ ] Conta na Railway (railway.app)
- [ ] Conta no Google Cloud (para OAuth)
- [ ] Conta de email SMTP (Gmail recomendado)
- [ ] Railway CLI instalado

## 🎯 1. Configuração do Backend na Railway

### 1.1 Deploy do Backend

```bash
cd backend
npm install -g @railway/cli
railway login
railway up
```

### 1.2 Configuração dos Serviços na Railway

1. **PostgreSQL Database**
   - Adicione um serviço PostgreSQL na Railway
   - Copie a `DATABASE_URL` das variáveis de ambiente

2. **Redis**
   - Adicione um serviço Redis na Railway
   - Copie a `REDIS_URL` das variáveis de ambiente

### 1.3 Variáveis de Ambiente na Railway

Configure as seguintes variáveis no dashboard da Railway:

```env
# Database
DATABASE_URL=postgresql://postgres:password@host:port/database

# Redis
REDIS_URL=redis://default:password@host:port

# Application
NODE_ENV=production
PORT=3333

# Security
JWT_SECRET=your-super-secure-jwt-secret-key-production-2024
JWT_REFRESH_SECRET=your-super-secure-refresh-secret-key-production-2024

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Email SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noreply@anacardoso.com
SMTP_PASS=your-gmail-app-password

# Frontend
FRONTEND_URL=https://ana-cardoso-bot-v2.vercel.app

# Rate Limiting
RATE_LIMIT_WINDOW=60000
RATE_LIMIT_MAX=100

# Logging
LOG_LEVEL=info
```

## 🎯 2. Configuração do Google OAuth

### 2.1 Google Cloud Console

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione existente
3. Ative a API "Google+ API"
4. Vá para "Credentials" > "Create Credentials" > "OAuth 2.0 Client ID"
5. Configure:
   - Application type: Web application
   - Authorized JavaScript origins: `https://your-railway-app.railway.app`
   - Authorized redirect URIs: `https://your-railway-app.railway.app/auth/google/callback`

### 2.2 Copiar Credenciais

- Copie `Client ID` para `GOOGLE_CLIENT_ID`
- Copie `Client Secret` para `GOOGLE_CLIENT_SECRET`

## 🎯 3. Configuração do Email SMTP

### 3.1 Gmail App Password

1. Ative a autenticação em duas etapas na sua conta Google
2. Vá para "App passwords" nas configurações de segurança
3. Gere uma senha de app para "Mail"
4. Use essa senha em `SMTP_PASS`

## 🎯 4. Deploy do Frontend

### 4.1 Vercel (Recomendado)

```bash
cd frontend
npm install -g vercel
vercel --prod
```

### 4.2 Configuração das Variáveis de Ambiente no Vercel

```env
NEXT_PUBLIC_API_URL=https://your-railway-app.railway.app
```

## 🎯 5. Verificação do Deploy

### 5.1 Testes de Backend

```bash
# Health check
curl https://your-railway-app.railway.app/health

# Test registration
curl -X POST https://your-railway-app.railway.app/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

### 5.2 Testes de Frontend

1. Acesse o frontend: `https://your-vercel-app.vercel.app`
2. Teste registro com confirmação de email
3. Teste login com Google
4. Teste dashboard e funcionalidades

## 🎯 6. Configuração Final

### 6.1 DNS e Domínios (Opcional)

1. Configure domínio personalizado na Railway
2. Configure domínio personalizado no Vercel
3. Atualize URLs nas configurações do Google OAuth

### 6.2 Monitoramento

1. Configure logs na Railway
2. Configure alertas de erro
3. Monitore performance e uso

## 🛠️ Troubleshooting

### Erro de Database Connection

```bash
# Verifique se o DATABASE_URL está correto
railway logs

# Force database migration
railway run npx prisma db push
```

### Erro de Email

- Verifique se a senha de app do Gmail está correta
- Confirme se SMTP_HOST e SMTP_PORT estão corretos

### Erro de OAuth

- Verifique se as URLs de redirect estão corretas no Google Console
- Confirme se GOOGLE_CLIENT_ID e GOOGLE_CLIENT_SECRET estão corretos

## 📞 Suporte

Para problemas de deploy, verifique:

1. Logs da Railway: `railway logs`
2. Logs do Vercel no dashboard
3. Console do navegador para erros de frontend
4. Status dos serviços na Railway

## ✅ Checklist Final

- [ ] Backend deployado na Railway
- [ ] PostgreSQL e Redis configurados
- [ ] Todas as variáveis de ambiente configuradas
- [ ] Google OAuth configurado
- [ ] SMTP configurado e testado
- [ ] Frontend deployado no Vercel
- [ ] Testes de registro e login funcionando
- [ ] Dashboard acessível
- [ ] Captura de leads funcionando
- [ ] Emails de confirmação sendo enviados

🎉 **Parabéns! Seu SaaS está 100% funcional em produção!**