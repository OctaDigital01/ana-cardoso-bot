# 🚀 Setup Guide - TelegramBot Manager

## Quick Start

### 1. Clone o repositório

```bash
git clone <repository-url>
cd telegram-bot-saas
```

### 2. Configure variáveis de ambiente

#### Backend
```bash
cd backend
cp .env.example .env
# Edite as configurações necessárias
```

#### Frontend  
```bash
cd frontend
cp .env.example .env.local
# Edite as configurações necessárias
```

### 3. Opção 1: Docker (Recomendado)

```bash
# Subir todos os serviços
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar serviços
docker-compose down
```

### 4. Opção 2: Desenvolvimento Local

#### Pré-requisitos
- Node.js 18+
- PostgreSQL 14+
- Redis 6+

#### Backend
```bash
cd backend
npm install
npx prisma migrate dev
npx prisma db seed
npm run dev
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 📋 Comandos Úteis

### Backend
```bash
# Desenvolvimento
npm run dev

# Build
npm run build

# Testes
npm run test

# Prisma
npx prisma studio
npx prisma migrate dev
npx prisma generate
```

### Frontend
```bash
# Desenvolvimento
npm run dev

# Build
npm run build

# Storybook
npm run storybook
```

### Docker
```bash
# Build e subir
docker-compose up --build -d

# Logs específicos
docker-compose logs backend
docker-compose logs frontend

# Reiniciar serviço
docker-compose restart backend

# Limpar tudo
docker-compose down -v
docker system prune -a
```

## 🌐 URLs de Acesso

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3333
- **Health Check**: http://localhost:3333/health
- **Prisma Studio**: http://localhost:5555
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

## 🛠️ Estrutura do Projeto

```
telegram-bot-saas/
├── backend/          # API Node.js + TypeScript
├── frontend/         # Next.js + React
├── database/         # Scripts e migrations
├── docs/            # Documentação
├── docker-compose.yml
└── railway.toml
```

## 🚂 Deploy no Railway

### 1. Instalar Railway CLI
```bash
npm install -g @railway/cli
```

### 2. Login e Deploy
```bash
railway login
railway init
railway up
```

### 3. Configurar Variáveis
```bash
# Backend
railway variables set DATABASE_URL=<postgres-url> --service backend
railway variables set REDIS_URL=<redis-url> --service backend

# Frontend  
railway variables set NEXT_PUBLIC_API_URL=<backend-url> --service frontend
```

## 🔧 Troubleshooting

### Problemas Comuns

#### 1. Erro de conexão com banco
```bash
# Verificar se PostgreSQL está rodando
docker-compose ps postgres

# Ver logs
docker-compose logs postgres
```

#### 2. Erro de porta em uso
```bash
# Verificar processos nas portas
lsof -i :3000
lsof -i :3333

# Matar processo
kill -9 <PID>
```

#### 3. Erro de dependências
```bash
# Limpar cache npm
rm -rf node_modules package-lock.json
npm install

# Ou usar yarn
rm -rf node_modules yarn.lock
yarn install
```

#### 4. Erro no Docker
```bash
# Limpar containers e images
docker-compose down -v
docker system prune -a

# Rebuild
docker-compose build --no-cache
```

### Logs importantes

#### Backend
- Aplicação: `docker-compose logs backend`
- Banco: `docker-compose logs postgres`  
- Redis: `docker-compose logs redis`

#### Frontend
- Aplicação: `docker-compose logs frontend`
- Build: Next.js mostra erros de build no terminal

## 📚 Documentação Adicional

- [Arquitetura](./docs/ARCHITECTURE.md)
- [API](./docs/API.md)  
- [Agents](./docs/AGENTS.md)
- [Deploy](./docs/DEPLOYMENT.md)
- [Design System](./docs/DESIGN_SYSTEM.md)

## 🆘 Suporte

- Email: suporte@telegrambotmanager.com
- Discord: [Comunidade](https://discord.gg/telegrambotmanager)
- Issues: [GitHub Issues](https://github.com/seu-usuario/telegram-bot-saas/issues)

## ✅ Checklist de Setup

- [ ] Variáveis de ambiente configuradas
- [ ] PostgreSQL rodando
- [ ] Redis rodando  
- [ ] Backend iniciado (porta 3333)
- [ ] Frontend iniciado (porta 3000)
- [ ] Health check retorna 200
- [ ] Prisma Studio acessível
- [ ] Logs sem erros críticos

---

💡 **Dica**: Use `docker-compose up -d` para desenvolvimento mais fácil!