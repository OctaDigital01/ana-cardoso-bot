# 🤖 Sistema de Agents Especializados - TelegramBot SaaS

## 🎯 Visão Geral

Este sistema de agents foi criado para organizar o desenvolvimento do TelegramBot SaaS, onde cada agent é um especialista em uma área específica do projeto. O **@agent-general-purpose** atua como coordenador principal, distribuindo tarefas automaticamente para os agents especializados.

### Hierarquia do Sistema
```
@agent-general-purpose (COORDENADOR)
├── @agent-backend-api
├── @agent-frontend-ui  
├── @agent-database
├── @agent-telegram-bot
├── @agent-flow-editor
├── @agent-payments
├── @agent-devops
├── @agent-auth-security
├── @agent-analytics
└── @agent-websocket-realtime
```

## 🎪 Como Funciona

### 1. **Chamada do Coordenador**
```
@agent-general-purpose [sua solicitação]
```
O agent geral analisa sua solicitação e automaticamente:
- Identifica qual(is) agent(s) especializado(s) deve(m) trabalhar
- Distribui as tarefas apropriadamente
- Coordena a colaboração entre agents
- Consolida os resultados

### 2. **Chamada Direta de Agents**
```
@agent-backend-api [tarefa específica de API]
@agent-frontend-ui [tarefa específica de UI]
```
Para tarefas muito específicas, você pode chamar direto o agent especializado.

---

## 🔧 Agents Especializados

### 1. @agent-backend-api
**Especialidade**: APIs REST, Backend Node.js, Middleware

**Tecnologias Dominadas:**
- Node.js + TypeScript + Express.js
- Prisma ORM + PostgreSQL
- JWT Authentication
- Middleware e validações (Joi/Zod)
- Error handling e logging
- Rate limiting e segurança
- Bull queues e jobs
- WebSocket (Socket.io)

**Responsabilidades:**
- Criar e otimizar endpoints da API
- Implementar middleware de autenticação
- Configurar validações de dados
- Gerenciar conexões com banco
- Implementar error handling
- Configurar rate limiting
- Criar jobs em background
- Documentar APIs

**Quando Chamar:**
- "Criar endpoint para gerenciar bots"
- "Implementar middleware de autenticação JWT"
- "Adicionar validação nos formulários"
- "Otimizar performance da API"
- "Configurar webhooks do Telegram"

**Exemplo de Solicitação:**
```
@agent-backend-api Preciso criar um endpoint POST /api/v1/bots 
que receba o token do BotFather, valide com a API do Telegram, 
e salve o bot no banco. Incluir middleware de autenticação JWT 
e validação dos dados de entrada.
```

---

### 2. @agent-frontend-ui
**Especialidade**: Interface do Usuário, Components React, Design System

**Tecnologias Dominadas:**
- Next.js 14 + React + TypeScript
- TailwindCSS + Design System Liquid Glass
- Framer Motion (animações)
- React Hook Form + Zod
- Zustand (state management)
- React Query (@tanstack/react-query)
- Radix UI components
- Responsive design (desktop + mobile)

**Responsabilidades:**
- Criar componentes UI reutilizáveis
- Implementar páginas e layouts
- Aplicar design system Liquid Glass
- Criar animações e transições
- Gerenciar estado da aplicação
- Implementar formulários validados
- Otimizar performance do frontend
- Garantir responsividade

**Quando Chamar:**
- "Criar página de dashboard"
- "Implementar formulário de criação de bot"
- "Adicionar animações na landing page"
- "Criar componente de card glassmorphism"
- "Implementar sidebar responsiva"

**Exemplo de Solicitação:**
```
@agent-frontend-ui Preciso criar uma página de dashboard com 
layout glassmorphism que mostre cards dos bots do usuário, 
métricas em tempo real e um botão para criar novo bot. 
Deve ser totalmente responsiva e ter animações suaves.
```

---

### 3. @agent-database
**Especialidade**: Banco de Dados, Queries, Performance

**Tecnologias Dominadas:**
- PostgreSQL 14+
- Prisma ORM
- Database design e modelagem
- Migrations e seeds
- Queries otimizadas
- Indexação e performance
- Backup e recovery
- Database security

**Responsabilidades:**
- Criar e otimizar schemas
- Escrever migrations
- Implementar seeds de dados
- Otimizar queries complexas
- Configurar índices
- Monitorar performance
- Implementar backups
- Garantir integridade referencial

**Quando Chamar:**
- "Criar tabela para armazenar fluxos"
- "Otimizar query lenta do dashboard"
- "Implementar soft delete nos bots"
- "Criar índices para performance"
- "Adicionar migration para nova feature"

**Exemplo de Solicitação:**
```
@agent-database Preciso criar uma estrutura completa para 
armazenar fluxos de conversação com nodes e edges. Deve 
suportar versionamento, ser otimizada para queries frequentes 
e ter relacionamento com a tabela de bots.
```

---

### 4. @agent-telegram-bot
**Especialidade**: Integração Telegram, Bot API, Webhooks

**Tecnologias Dominadas:**
- Telegram Bot API
- Telegraf.js framework
- Webhooks e polling
- Comandos e inline keyboards
- Media handling (imagens, vídeos)
- Bot permissions e admin
- Telegram payments
- Deep linking

**Responsabilidades:**
- Integrar com Telegram Bot API
- Configurar webhooks
- Implementar comandos de bot
- Gerenciar keyboards inline
- Processar mídia
- Implementar fluxos de conversação
- Configurar pagamentos Telegram
- Testar bots

**Quando Chamar:**
- "Configurar webhook para bot"
- "Implementar comando /start"
- "Criar keyboard inline para menu"
- "Processar imagens enviadas pelo usuário"
- "Configurar Telegram Payments"

**Exemplo de Solicitação:**
```
@agent-telegram-bot Preciso configurar um webhook que receba 
mensagens do Telegram, processe o fluxo ativo do usuário, 
execute a lógica correspondente e envie a resposta apropriada. 
Incluir tratamento de erro e logging.
```

---

### 5. @agent-flow-editor
**Especialidade**: Editor Visual, React Flow, Workflows

**Tecnologias Dominadas:**
- React Flow (react-flow)
- Drag & drop functionality
- Custom nodes e edges
- Flow validation
- Workflow execution engine
- Canvas interactions
- Node types (message, condition, action)
- Flow state management

**Responsabilidades:**
- Implementar editor visual de fluxos
- Criar nodes customizados
- Implementar drag & drop
- Validar lógica de fluxos
- Criar engine de execução
- Gerenciar estado do canvas
- Implementar templates
- Otimizar performance do editor

**Quando Chamar:**
- "Criar editor de fluxos drag & drop"
- "Implementar node customizado para mensagem"
- "Adicionar validação de fluxos"
- "Criar templates de fluxo"
- "Otimizar performance do canvas"

**Exemplo de Solicitação:**
```
@agent-flow-editor Preciso implementar um editor visual onde 
usuários possam criar fluxos de conversação arrastando nodes 
(mensagem, condição, delay, ação) e conectando com edges. 
Deve validar a lógica e permitir preview do fluxo.
```

---

### 6. @agent-payments
**Especialidade**: Integração Pagamentos, PIX, Gateways

**Tecnologias Dominadas:**
- MercadoPago SDK
- Stripe API
- PIX integration
- Webhook processing
- Payment reconciliation
- Subscription management
- Invoice generation
- PCI compliance

**Responsabilidades:**
- Integrar gateways de pagamento
- Implementar PIX automático
- Processar webhooks de pagamento
- Gerenciar assinaturas
- Implementar reconciliação
- Gerar relatórios financeiros
- Configurar planos e preços
- Garantir segurança PCI

**Quando Chamar:**
- "Integrar PIX do MercadoPago"
- "Implementar webhook de pagamento"
- "Criar sistema de assinaturas"
- "Processar reembolsos"
- "Gerar relatório de vendas"

**Exemplo de Solicitação:**
```
@agent-payments Preciso implementar cobrança PIX automática 
quando usuário quiser upgrade para plano PRO. Deve gerar QR code, 
processar webhook de confirmação e ativar funcionalidades premium 
automaticamente.
```

---

### 7. @agent-devops
**Especialidade**: Deploy, Docker, CI/CD, Monitoring

**Tecnologias Dominadas:**
- Docker + docker-compose
- Railway deployment
- CI/CD pipelines (GitHub Actions)
- Monitoring (logs, metrics)
- Load balancing
- SSL/TLS configuration
- Environment management
- Backup strategies

**Responsabilidades:**
- Configurar containerização
- Implementar deploy automático
- Configurar CI/CD
- Monitorar aplicação
- Gerenciar ambientes
- Implementar logging
- Configurar backups
- Otimizar performance

**Quando Chamar:**
- "Configurar deploy no Railway"
- "Criar pipeline de CI/CD"
- "Implementar monitoring"
- "Otimizar Docker images"
- "Configurar load balancer"

**Exemplo de Solicitação:**
```
@agent-devops Preciso configurar deploy automático no Railway 
com containers separados para backend, frontend e banco. 
Incluir health checks, logs centralizados e rollback automático 
em caso de falha.
```

---

### 8. @agent-auth-security
**Especialidade**: Autenticação, Segurança, Criptografia

**Tecnologias Dominadas:**
- JWT + Refresh tokens
- bcrypt password hashing
- OAuth2 / Social login
- Rate limiting
- CORS configuration
- Input sanitization
- OWASP security practices
- Encryption (AES)

**Responsabilidades:**
- Implementar autenticação completa
- Configurar autorização (RBAC)
- Implementar rate limiting
- Garantir segurança de APIs
- Criptografar dados sensíveis
- Configurar CORS
- Implementar 2FA
- Auditoria de segurança

**Quando Chamar:**
- "Implementar login/registro"
- "Configurar autenticação JWT"
- "Adicionar rate limiting"
- "Implementar 2FA"
- "Criptografar tokens de bot"

**Exemplo de Solicitação:**
```
@agent-auth-security Preciso implementar autenticação completa 
com JWT, refresh tokens, rate limiting por IP e usuário, 
criptografia dos tokens de bot e middleware de autorização 
baseado em roles.
```

---

### 9. @agent-analytics
**Especialidade**: Métricas, Dashboards, Relatórios

**Tecnologias Dominadas:**
- Recharts / Chart.js
- Dashboard creation
- Real-time metrics
- Data aggregation
- KPI tracking
- Custom reports
- Data visualization
- Performance analytics

**Responsabilidades:**
- Criar dashboards interativos
- Implementar métricas em tempo real
- Gerar relatórios customizados
- Configurar KPIs importantes
- Implementar tracking de eventos
- Criar visualizações de dados
- Otimizar queries de analytics
- Implementar alertas

**Quando Chamar:**
- "Criar dashboard de métricas"
- "Implementar tracking de eventos"
- "Gerar relatório de performance"
- "Criar gráficos de conversão"
- "Configurar alertas de KPI"

**Exemplo de Solicitação:**
```
@agent-analytics Preciso criar um dashboard que mostre métricas 
em tempo real dos bots: mensagens enviadas/recebidas, usuários 
ativos, taxa de conversão e receita. Com gráficos interativos 
e filtros por período.
```

---

### 10. @agent-websocket-realtime
**Especialidade**: WebSocket, Comunicação Real-time

**Tecnologias Dominadas:**
- Socket.io (server + client)
- Real-time events
- Room management
- Connection handling
- Event broadcasting
- Real-time collaboration
- Live updates
- Connection fallbacks

**Responsabilidades:**
- Implementar WebSocket server/client
- Gerenciar conexões em tempo real
- Implementar sistema de rooms
- Criar eventos customizados
- Sincronizar dados em tempo real
- Implementar colaboração ao vivo
- Otimizar performance WebSocket
- Implementar fallbacks

**Quando Chamar:**
- "Implementar chat em tempo real"
- "Sincronizar editor de fluxos"
- "Criar notificações live"
- "Implementar colaboração ao vivo"
- "Otimizar conexões WebSocket"

**Exemplo de Solicitação:**
```
@agent-websocket-realtime Preciso implementar atualização em 
tempo real no editor de fluxos, onde múltiplos usuários podem 
colaborar simultaneamente, vendo mudanças instantaneamente 
e recebendo notificações de novas mensagens nos bots.
```

---

## 🎭 Fluxos de Trabalho Típicos

### Cenário 1: Criar Nova Feature Completa
```
Usuário: @agent-general-purpose Quero implementar sistema de templates de fluxo

Coordenador distribui:
1. @agent-database → Criar tabelas para templates
2. @agent-backend-api → Criar endpoints CRUD
3. @agent-frontend-ui → Criar interface de templates
4. @agent-flow-editor → Integrar templates no editor
```

### Cenário 2: Resolver Bug Específico
```
Usuário: @agent-backend-api API de criação de bot está retornando 500

Agent Backend foca especificamente em:
- Analisar logs de erro
- Identificar problema na validação
- Corrigir middleware
- Testar endpoint
```

### Cenário 3: Otimização de Performance
```
Usuário: @agent-general-purpose Dashboard está lento

Coordenador distribui:
1. @agent-database → Otimizar queries
2. @agent-frontend-ui → Implementar lazy loading
3. @agent-analytics → Cache de métricas
4. @agent-devops → Monitorar performance
```

---

## 📋 Manual de Uso

### ✅ Quando Chamar @agent-general-purpose
- Tarefas que envolvem múltiplas áreas
- Novas features completas
- Resolução de problemas complexos
- Planejamento de arquitetura
- Coordenação entre componentes

### ✅ Quando Chamar Agents Específicos
- Tarefa muito específica de uma área
- Bug pontual em componente específico
- Otimização técnica especializada
- Implementação de funcionalidade isolada

### 📝 Templates de Solicitação

**Para Features Completas:**
```
@agent-general-purpose Preciso implementar [feature] que inclui:
- [aspecto backend]
- [aspecto frontend]  
- [aspecto banco de dados]
- [outros aspectos]
```

**Para Tarefas Específicas:**
```
@agent-[especialidade] Preciso [tarefa específica] que deve:
- [requisito 1]
- [requisito 2]
- [critério de aceitação]
```

### 🎯 Exemplos Práticos

**Exemplo 1 - Feature Completa:**
```
@agent-general-purpose Implementar sistema de notificações push que:
- Envie alertas quando bot receber mensagem
- Tenha configurações por usuário  
- Funcione em tempo real
- Seja persistente no banco
```

**Exemplo 2 - Tarefa Específica:**
```
@agent-frontend-ui Criar modal de configurações do bot com:
- Design glassmorphism
- Tabs para diferentes seções
- Formulário validado
- Animações suaves
```

**Exemplo 3 - Resolução de Bug:**
```
@agent-database Query do dashboard está lenta, preciso:
- Analisar query atual
- Adicionar índices apropriados
- Otimizar joins
- Testar performance
```

---

## 🔄 Colaboração Entre Agents

Os agents trabalham em colaboração automática:

### Backend ↔ Frontend
- Backend cria API → Frontend consome
- Frontend define necessidades → Backend implementa

### Database ↔ Backend
- Database otimiza → Backend aproveita
- Backend solicita → Database entrega

### DevOps ↔ Todos
- Monitora performance de todos
- Implementa deploy de todos
- Gerencia logs de todos

---

## 🎖️ Vantagens do Sistema

### ✅ Para o Desenvolvedor
- **Expertise Focada**: Cada agent domina perfeitamente sua área
- **Eficiência**: Sem perda de tempo explicando contexto
- **Qualidade**: Código especializado e otimizado
- **Aprendizado**: Absorve melhores práticas de cada área

### ✅ Para o Projeto
- **Arquitetura Consistente**: Padrões mantidos por especialistas
- **Performance Otimizada**: Cada componente otimizado por expert
- **Manutenibilidade**: Código organizado e bem estruturado
- **Escalabilidade**: Arquitetura pensada para crescimento

### ✅ Para a Equipe
- **Produtividade**: Desenvolvimento paralelo e eficiente
- **Conhecimento**: Expertise distribuída e acessível
- **Colaboração**: Coordenação automática entre áreas
- **Resultado**: Produto final profissional e robusto

---

## 🚀 Começando

1. **Identifique sua necessidade**
2. **Escolha o agent apropriado** (ou use @agent-general-purpose)
3. **Descreva claramente o que precisa**
4. **Aguarde a coordenação e execução**
5. **Revise e aprove o resultado**

### Sua Equipe Virtual Está Pronta! 🎉