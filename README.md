# 🤖 TelegramBot Manager - SaaS Platform

> Plataforma completa para criação e gerenciamento de bots do Telegram com interface intuitiva e design moderno.

## 📋 Visão Geral

O **TelegramBot Manager** é uma solução SaaS que permite criar, configurar e gerenciar bots do Telegram de forma visual e intuitiva, com integrações de pagamento e analytics avançado.

## 🚀 Características Principais

- ✨ **Design Liquid Glass** inspirado na Apple
- 🔄 **Editor Visual de Fluxos** com drag & drop
- 💬 **Mensagens Personalizadas** com templates
- 💳 **Integração com Pagamentos** (PIX, Cartão)
- 📊 **Analytics em Tempo Real**
- 🔐 **Autenticação Segura** com JWT
- 📱 **100% Responsivo** (Desktop e Mobile)
- ⚡ **Alta Performance** com cache Redis

## 🛠️ Stack Tecnológica

### Backend
- Node.js + TypeScript
- Express.js
- PostgreSQL + Prisma ORM
- Redis (Cache)
- Socket.io (Real-time)
- Telegraf.js (Telegram Bot API)

### Frontend
- Next.js 14
- TypeScript
- Tailwind CSS
- Framer Motion
- React Flow
- Zustand

## 📁 Estrutura do Projeto

```
telegram-bot-saas/
├── backend/          # API e lógica de negócio
├── frontend/         # Interface do usuário
├── database/         # Migrations e seeds
├── docs/            # Documentação adicional
└── docker-compose.yml
```

## 🚀 Quick Start

### Pré-requisitos
- Node.js 18+
- PostgreSQL 14+
- Redis 6+
- Docker (opcional)

### Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/telegram-bot-saas.git
cd telegram-bot-saas
```

2. **Configure as variáveis de ambiente**
```bash
# Backend
cp backend/.env.example backend/.env

# Frontend
cp frontend/.env.example frontend/.env
```

3. **Instale as dependências**
```bash
# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

4. **Configure o banco de dados**
```bash
cd backend
npx prisma migrate dev
npx prisma db seed
```

5. **Execute o projeto**
```bash
# Backend (porta 3333)
npm run dev

# Frontend (porta 3000)
cd ../frontend
npm run dev
```

## 🐳 Docker

```bash
docker-compose up -d
```

## 🚂 Deploy no Railway

O projeto está configurado para deploy automático no Railway:

1. Conecte seu repositório GitHub
2. Configure as variáveis de ambiente
3. Deploy automático em cada push

## 📚 Documentação

- [Arquitetura](./docs/ARCHITECTURE.md)
- [API](./docs/API.md)
- [Agents](./docs/AGENTS.md)
- [Deploy](./docs/DEPLOYMENT.md)
- [Design System](./docs/DESIGN_SYSTEM.md)

## 🔑 Variáveis de Ambiente

### Backend
```env
# Banco de Dados
DATABASE_URL="postgresql://user:pass@localhost:5432/telegram_bot_saas"

# Redis
REDIS_URL="redis://localhost:6379"

# JWT
JWT_SECRET="seu-secret-aqui"

# Telegram
TELEGRAM_WEBHOOK_URL="https://seu-dominio.com/webhook"

# Pagamento
MERCADOPAGO_ACCESS_TOKEN="seu-token"
```

### Frontend
```env
NEXT_PUBLIC_API_URL="http://localhost:3333"
NEXT_PUBLIC_WS_URL="ws://localhost:3333"
```

## 📱 Funcionalidades

### Dashboard
- Visão geral de todos os bots
- Métricas em tempo real
- Gráficos de desempenho

### Gerenciador de Bots
- Criar novo bot com token do BotFather
- Configurar comandos e respostas
- Ativar/desativar bots

### Editor de Fluxos
- Interface visual drag & drop
- Blocos condicionais
- Delays configuráveis
- Preview em tempo real

### Sistema de Mensagens
- Templates salvos
- Variáveis dinâmicas
- Suporte a mídia
- Botões interativos

### Integrações
- Gateway de pagamento
- Webhooks personalizados
- APIs externas

## 🧪 Testes

```bash
# Backend
cd backend
npm run test
npm run test:e2e

# Frontend
cd frontend
npm run test
npm run test:e2e
```

## 📈 Performance

- Lighthouse Score: 95+
- Time to Interactive: < 2s
- First Contentful Paint: < 1s
- Bundle Size: < 200KB

## 🔐 Segurança

- Autenticação JWT
- Rate limiting
- CORS configurado
- SQL Injection protection
- XSS protection
- HTTPS enforced

## 👥 Contribuindo

1. Fork o projeto
2. Crie sua branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

- Email: suporte@telegrambotmanager.com
- Discord: [Comunidade](https://discord.gg/telegrambotmanager)
- Documentação: [docs.telegrambotmanager.com](https://docs.telegrambotmanager.com)

## 🙏 Agradecimentos

- Telegram Bot API
- Comunidade Open Source
- Todos os contribuidores

---

Feito com ❤️ por [Seu Nome]