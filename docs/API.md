# 📡 API Documentation

## Base URL

```
Development: http://localhost:3333/api/v1
Production: https://api.telegrambotmanager.com/v1
```

## Autenticação

Todas as requisições (exceto login e registro) requerem um token JWT no header:

```http
Authorization: Bearer {token}
```

## Rate Limiting

- **Padrão**: 100 requisições por minuto
- **Pro**: 500 requisições por minuto
- **Enterprise**: Ilimitado

## Endpoints

### 🔐 Autenticação

#### POST /auth/register
Criar nova conta

**Request:**
```json
{
  "email": "user@example.com",
  "password": "senha123",
  "name": "João Silva"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "João Silva",
    "plan": "free"
  },
  "token": "jwt-token",
  "refreshToken": "refresh-token"
}
```

#### POST /auth/login
Fazer login

**Request:**
```json
{
  "email": "user@example.com",
  "password": "senha123"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "João Silva"
  },
  "token": "jwt-token",
  "refreshToken": "refresh-token"
}
```

#### POST /auth/refresh
Renovar token

**Request:**
```json
{
  "refreshToken": "refresh-token"
}
```

**Response:**
```json
{
  "token": "new-jwt-token",
  "refreshToken": "new-refresh-token"
}
```

#### POST /auth/logout
Fazer logout

**Response:**
```json
{
  "message": "Logout realizado com sucesso"
}
```

### 🤖 Bots

#### GET /bots
Listar todos os bots do usuário

**Query Parameters:**
- `page` (opcional): Página atual (default: 1)
- `limit` (opcional): Itens por página (default: 10)
- `active` (opcional): Filtrar por status (true/false)

**Response:**
```json
{
  "bots": [
    {
      "id": "uuid",
      "name": "Meu Bot",
      "username": "@meubot",
      "active": true,
      "createdAt": "2024-01-01T00:00:00Z",
      "metrics": {
        "totalUsers": 1000,
        "activeUsers": 150,
        "messagestoday": 500
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

#### GET /bots/:id
Obter detalhes de um bot

**Response:**
```json
{
  "id": "uuid",
  "name": "Meu Bot",
  "username": "@meubot",
  "token": "encrypted",
  "active": true,
  "webhookUrl": "https://api.example.com/webhook",
  "settings": {
    "welcomeMessage": "Bem-vindo!",
    "commands": [
      {
        "command": "start",
        "description": "Iniciar conversa"
      }
    ]
  },
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

#### POST /bots
Criar novo bot

**Request:**
```json
{
  "token": "bot-token-from-botfather",
  "name": "Meu Bot Personalizado"
}
```

**Response:**
```json
{
  "id": "uuid",
  "name": "Meu Bot Personalizado",
  "username": "@meubot",
  "active": false,
  "createdAt": "2024-01-01T00:00:00Z"
}
```

#### PUT /bots/:id
Atualizar bot

**Request:**
```json
{
  "name": "Novo Nome",
  "active": true,
  "settings": {
    "welcomeMessage": "Olá! Como posso ajudar?"
  }
}
```

**Response:**
```json
{
  "id": "uuid",
  "name": "Novo Nome",
  "active": true,
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

#### DELETE /bots/:id
Deletar bot

**Response:**
```json
{
  "message": "Bot deletado com sucesso"
}
```

#### POST /bots/:id/webhook
Configurar webhook

**Request:**
```json
{
  "url": "https://seu-dominio.com/webhook"
}
```

**Response:**
```json
{
  "success": true,
  "webhookUrl": "https://seu-dominio.com/webhook"
}
```

### 🔄 Fluxos

#### GET /bots/:botId/flows
Listar fluxos de um bot

**Response:**
```json
{
  "flows": [
    {
      "id": "uuid",
      "name": "Fluxo Principal",
      "active": true,
      "version": 1,
      "nodes": 10,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### GET /flows/:id
Obter detalhes de um fluxo

**Response:**
```json
{
  "id": "uuid",
  "botId": "bot-uuid",
  "name": "Fluxo Principal",
  "active": true,
  "version": 1,
  "nodes": [
    {
      "id": "node1",
      "type": "start",
      "position": { "x": 100, "y": 100 },
      "data": {}
    },
    {
      "id": "node2",
      "type": "message",
      "position": { "x": 250, "y": 100 },
      "data": {
        "text": "Olá! Bem-vindo!"
      }
    }
  ],
  "edges": [
    {
      "id": "edge1",
      "source": "node1",
      "target": "node2"
    }
  ]
}
```

#### POST /bots/:botId/flows
Criar novo fluxo

**Request:**
```json
{
  "name": "Novo Fluxo",
  "nodes": [],
  "edges": []
}
```

**Response:**
```json
{
  "id": "uuid",
  "name": "Novo Fluxo",
  "version": 1,
  "createdAt": "2024-01-01T00:00:00Z"
}
```

#### PUT /flows/:id
Atualizar fluxo

**Request:**
```json
{
  "name": "Fluxo Atualizado",
  "nodes": [...],
  "edges": [...],
  "active": true
}
```

**Response:**
```json
{
  "id": "uuid",
  "version": 2,
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

#### POST /flows/:id/test
Testar fluxo

**Request:**
```json
{
  "startNode": "node1",
  "testData": {
    "user": {
      "name": "Teste"
    }
  }
}
```

**Response:**
```json
{
  "success": true,
  "path": ["node1", "node2", "node3"],
  "outputs": [
    {
      "node": "node2",
      "output": "Olá, Teste!"
    }
  ]
}
```

### 💬 Mensagens

#### GET /messages/templates
Listar templates de mensagens

**Response:**
```json
{
  "templates": [
    {
      "id": "uuid",
      "name": "Boas-vindas",
      "content": "Olá {{name}}! Bem-vindo!",
      "variables": ["name"],
      "category": "greeting"
    }
  ]
}
```

#### POST /messages/templates
Criar template

**Request:**
```json
{
  "name": "Novo Template",
  "content": "Olá {{name}}!",
  "category": "greeting"
}
```

**Response:**
```json
{
  "id": "uuid",
  "name": "Novo Template",
  "variables": ["name"],
  "createdAt": "2024-01-01T00:00:00Z"
}
```

#### POST /messages/send
Enviar mensagem teste

**Request:**
```json
{
  "botId": "uuid",
  "chatId": "123456",
  "text": "Mensagem de teste",
  "parseMode": "HTML",
  "replyMarkup": {
    "inline_keyboard": [
      [
        {
          "text": "Botão",
          "callback_data": "button_click"
        }
      ]
    ]
  }
}
```

**Response:**
```json
{
  "success": true,
  "messageId": 789
}
```

### 💳 Pagamentos

#### GET /payments
Listar pagamentos

**Query Parameters:**
- `status`: pending | completed | failed | refunded
- `startDate`: Data inicial (ISO 8601)
- `endDate`: Data final (ISO 8601)

**Response:**
```json
{
  "payments": [
    {
      "id": "uuid",
      "amount": 99.90,
      "currency": "BRL",
      "status": "completed",
      "method": "pix",
      "customer": {
        "name": "João Silva",
        "email": "joao@example.com"
      },
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "summary": {
    "total": 1500.00,
    "pending": 300.00,
    "completed": 1200.00
  }
}
```

#### POST /payments
Criar cobrança

**Request:**
```json
{
  "amount": 99.90,
  "method": "pix",
  "description": "Plano Pro - Mensal",
  "customer": {
    "name": "João Silva",
    "email": "joao@example.com",
    "cpf": "123.456.789-00"
  }
}
```

**Response:**
```json
{
  "id": "uuid",
  "amount": 99.90,
  "method": "pix",
  "status": "pending",
  "pixCode": "00020126580014BR.GOV.BCB.PIX...",
  "qrCode": "data:image/png;base64,...",
  "expiresAt": "2024-01-02T00:00:00Z"
}
```

#### GET /payments/:id
Obter detalhes do pagamento

**Response:**
```json
{
  "id": "uuid",
  "amount": 99.90,
  "currency": "BRL",
  "status": "completed",
  "method": "pix",
  "customer": {
    "name": "João Silva",
    "email": "joao@example.com"
  },
  "timeline": [
    {
      "status": "created",
      "timestamp": "2024-01-01T00:00:00Z"
    },
    {
      "status": "pending",
      "timestamp": "2024-01-01T00:01:00Z"
    },
    {
      "status": "completed",
      "timestamp": "2024-01-01T00:05:00Z"
    }
  ]
}
```

#### POST /payments/:id/refund
Reembolsar pagamento

**Request:**
```json
{
  "amount": 50.00,
  "reason": "Solicitação do cliente"
}
```

**Response:**
```json
{
  "id": "refund-uuid",
  "paymentId": "payment-uuid",
  "amount": 50.00,
  "status": "processing",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### 📊 Analytics

#### GET /analytics/dashboard
Dashboard geral

**Query Parameters:**
- `period`: today | week | month | year
- `botId` (opcional): Filtrar por bot

**Response:**
```json
{
  "metrics": {
    "totalUsers": 5000,
    "activeUsers": 1200,
    "newUsers": 150,
    "messages": {
      "sent": 10000,
      "received": 8500
    },
    "revenue": 15000.00,
    "conversionRate": 0.15
  },
  "charts": {
    "users": [
      { "date": "2024-01-01", "value": 100 },
      { "date": "2024-01-02", "value": 120 }
    ],
    "messages": [
      { "date": "2024-01-01", "sent": 500, "received": 450 }
    ]
  }
}
```

#### GET /analytics/funnel/:botId
Análise de funil

**Response:**
```json
{
  "funnel": [
    {
      "step": "Início",
      "users": 1000,
      "percentage": 100
    },
    {
      "step": "Cadastro",
      "users": 600,
      "percentage": 60
    },
    {
      "step": "Pagamento",
      "users": 150,
      "percentage": 15
    }
  ],
  "dropoff": [
    {
      "from": "Início",
      "to": "Cadastro",
      "rate": 0.4
    }
  ]
}
```

#### POST /analytics/events
Registrar evento

**Request:**
```json
{
  "event": "button_click",
  "botId": "uuid",
  "userId": "telegram-user-id",
  "properties": {
    "button": "buy_now",
    "screen": "product_details"
  }
}
```

**Response:**
```json
{
  "success": true,
  "eventId": "uuid"
}
```

### 🔔 Webhooks

#### POST /webhooks/telegram/:botId
Receber webhook do Telegram

**Request:**
```json
{
  "update_id": 123456,
  "message": {
    "message_id": 789,
    "from": {
      "id": 123,
      "first_name": "João"
    },
    "chat": {
      "id": 123,
      "type": "private"
    },
    "text": "/start"
  }
}
```

**Response:**
```json
{
  "ok": true
}
```

#### POST /webhooks/payment
Receber webhook de pagamento

**Headers:**
```http
X-Signature: hmac-sha256-signature
```

**Request:**
```json
{
  "id": "payment-id",
  "status": "approved",
  "external_reference": "order-123"
}
```

**Response:**
```json
{
  "received": true
}
```

## WebSocket Events

### Conexão
```javascript
const ws = new WebSocket('wss://api.telegrambotmanager.com/ws')

ws.send(JSON.stringify({
  type: 'auth',
  token: 'jwt-token'
}))
```

### Eventos

#### flow:update
Atualização em tempo real do fluxo
```json
{
  "type": "flow:update",
  "data": {
    "flowId": "uuid",
    "nodes": [...],
    "edges": [...]
  }
}
```

#### bot:message
Nova mensagem recebida
```json
{
  "type": "bot:message",
  "data": {
    "botId": "uuid",
    "message": {
      "from": "user-name",
      "text": "Mensagem"
    }
  }
}
```

#### payment:status
Atualização de status de pagamento
```json
{
  "type": "payment:status",
  "data": {
    "paymentId": "uuid",
    "status": "completed"
  }
}
```

## Códigos de Erro

| Código | Descrição |
|--------|-----------|
| 400 | Bad Request - Parâmetros inválidos |
| 401 | Unauthorized - Token inválido ou expirado |
| 403 | Forbidden - Sem permissão |
| 404 | Not Found - Recurso não encontrado |
| 409 | Conflict - Recurso já existe |
| 422 | Unprocessable Entity - Validação falhou |
| 429 | Too Many Requests - Rate limit excedido |
| 500 | Internal Server Error - Erro no servidor |

### Formato de Erro

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Erro de validação",
    "details": [
      {
        "field": "email",
        "message": "Email inválido"
      }
    ]
  }
}
```

## SDKs

### JavaScript/TypeScript
```bash
npm install @telegrambotmanager/sdk
```

```typescript
import { TelegramBotManager } from '@telegrambotmanager/sdk'

const client = new TelegramBotManager({
  apiKey: 'your-api-key'
})

const bots = await client.bots.list()
```

### Python
```bash
pip install telegrambotmanager
```

```python
from telegrambotmanager import Client

client = Client(api_key='your-api-key')
bots = client.bots.list()
```

## Postman Collection

Download: [TelegramBotManager.postman_collection.json](https://api.telegrambotmanager.com/postman)

## Suporte

- Email: api@telegrambotmanager.com
- Discord: [Developer Community](https://discord.gg/telegrambotmanager-dev)
- Status: [status.telegrambotmanager.com](https://status.telegrambotmanager.com)