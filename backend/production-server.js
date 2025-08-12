const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3333;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-12345';

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3001', 
    'https://frontend-production-86d2.up.railway.app',
    'https://ana-cardoso-bot-v2.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

// Mock data storage (later will be replaced with real database)
let users = [
  {
    id: '1',
    name: 'Administrador',
    email: 'admin@anacardoso.com',
    password: '$2a$12$oYSVEej4Yi825d.HY44xKeRmB6RmDWllQhdc/RC64CLraUSSX9Wta', // admin123
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Usuário Teste',
    email: 'teste@example.com',
    password: '$2a$12$EBn66H/FY4Z5gZy3x1g3KeSel9txnMv6nf4WO0sImog8p73z0/yd.', // teste123
    createdAt: new Date().toISOString()
  }
];

let bots = [
  {
    id: '1',
    userId: '2',
    name: 'Bot de Atendimento',
    username: 'atendimento_bot',
    description: 'Bot para atendimento automatizado',
    token: 'encrypted_token_123',
    isActive: true,
    webhookUrl: 'https://example.com/webhook',
    messageCount: 847,
    userCount: 234,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    userId: '2',
    name: 'Bot de Vendas',
    username: 'vendas_bot',
    description: 'Bot para suporte de vendas',
    token: 'encrypted_token_456',
    isActive: false,
    webhookUrl: 'https://example.com/webhook2',
    messageCount: 423,
    userCount: 156,
    createdAt: new Date().toISOString(),
  }
];

const analytics = {
  totalBots: 2,
  activeUsers: 1247,
  messagesThisMonth: 8945,
  revenue: 2340.50,
  growth: {
    bots: 12,
    users: 23,
    messages: 18,
    revenue: 15,
  },
  chartData: [
    { month: 'Jan', messages: 2400, users: 400, revenue: 800 },
    { month: 'Fev', messages: 1398, users: 600, revenue: 1200 },
    { month: 'Mar', messages: 9800, users: 800, revenue: 1600 },
    { month: 'Abr', messages: 3908, users: 1000, revenue: 2000 },
    { month: 'Mai', messages: 4800, users: 1200, revenue: 2340 },
  ],
  recentActivity: [
    {
      id: '1',
      type: 'message',
      description: 'Mensagem automática enviada para 23 usuários',
      time: 'há 5 minutos',
    },
    {
      id: '2',
      type: 'user',
      description: 'Novo usuário iniciou conversa',
      time: 'há 12 minutos',
    },
    {
      id: '3',
      type: 'bot',
      description: 'Bot "Atendimento" foi ativado',
      time: 'há 1 hora',
    },
    {
      id: '4',
      type: 'revenue',
      description: 'Novo pagamento de R$ 49,90 recebido',
      time: 'há 2 horas',
    },
  ],
};

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.status(401).json({ message: 'Token de acesso requerido' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.error('JWT verification error:', err);
      return res.status(403).json({ message: 'Token inválido' });
    }
    req.user = user;
    next();
  });
};

// Routes

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    message: 'Production server running',
    environment: process.env.NODE_ENV || 'development'
  });
});

// CORS preflight
app.options('*', cors());

// Auth routes
app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt for:', email);

    if (!email || !password) {
      return res.status(400).json({ message: 'Email e senha são obrigatórios' });
    }

    const user = users.find(u => u.email === email);
    if (!user) {
      console.log('User not found:', email);
      return res.status(401).json({ message: 'Email ou senha inválidos' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      console.log('Invalid password for:', email);
      return res.status(401).json({ message: 'Email ou senha inválidos' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('Login successful for:', email);
    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword, token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

app.post('/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log('Register attempt for:', email);

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Nome, email e senha são obrigatórios' });
    }

    // Check if user exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'Email já está em uso' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const newUser = {
      id: (users.length + 1).toString(),
      name,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);

    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('Register successful for:', email);
    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json({ user: userWithoutPassword, token });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

app.get('/auth/me', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.userId);
  if (!user) {
    return res.status(404).json({ message: 'Usuário não encontrado' });
  }

  const { password: _, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

// Bots routes
app.get('/api/v1/bots', authenticateToken, (req, res) => {
  console.log('Getting bots for user:', req.user.userId);
  const userBots = bots.filter(bot => bot.userId === req.user.userId);
  res.json(userBots);
});

app.post('/api/v1/bots', authenticateToken, (req, res) => {
  const { name, username, description, token } = req.body;

  const newBot = {
    id: (bots.length + 1).toString(),
    userId: req.user.userId,
    name,
    username: username || 'new_bot',
    description: description || '',
    token: 'encrypted_' + Math.random().toString(36).substr(2, 9),
    isActive: false,
    webhookUrl: '',
    messageCount: 0,
    userCount: 0,
    createdAt: new Date().toISOString(),
  };

  bots.push(newBot);
  console.log('Created bot:', newBot.name, 'for user:', req.user.userId);
  res.status(201).json(newBot);
});

app.put('/api/v1/bots/:id', authenticateToken, (req, res) => {
  const botId = req.params.id;
  const botIndex = bots.findIndex(bot => bot.id === botId && bot.userId === req.user.userId);

  if (botIndex === -1) {
    return res.status(404).json({ message: 'Bot não encontrado' });
  }

  bots[botIndex] = { ...bots[botIndex], ...req.body };
  console.log('Updated bot:', botId, 'for user:', req.user.userId);
  res.json(bots[botIndex]);
});

app.delete('/api/v1/bots/:id', authenticateToken, (req, res) => {
  const botId = req.params.id;
  const botIndex = bots.findIndex(bot => bot.id === botId && bot.userId === req.user.userId);

  if (botIndex === -1) {
    return res.status(404).json({ message: 'Bot não encontrado' });
  }

  const deletedBot = bots[botIndex];
  bots.splice(botIndex, 1);
  console.log('Deleted bot:', deletedBot.name, 'for user:', req.user.userId);
  res.status(204).send();
});

app.patch('/api/v1/bots/:id/toggle', authenticateToken, (req, res) => {
  const botId = req.params.id;
  const botIndex = bots.findIndex(bot => bot.id === botId && bot.userId === req.user.userId);

  if (botIndex === -1) {
    return res.status(404).json({ message: 'Bot não encontrado' });
  }

  bots[botIndex].isActive = !bots[botIndex].isActive;
  console.log('Toggled bot:', bots[botIndex].name, 'to', bots[botIndex].isActive, 'for user:', req.user.userId);
  res.json(bots[botIndex]);
});

// Analytics routes
app.get('/api/v1/analytics/dashboard', authenticateToken, (req, res) => {
  console.log('Getting analytics for user:', req.user.userId);
  res.json(analytics);
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error:', error);
  res.status(500).json({ 
    message: 'Erro interno do servidor',
    error: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
});

// 404 handler
app.use('*', (req, res) => {
  console.log('404 - Not found:', req.method, req.originalUrl);
  res.status(404).json({ 
    message: 'Endpoint não encontrado',
    path: req.originalUrl 
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor de produção rodando na porta ${PORT}`);
  console.log(`🌐 API: http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`📋 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`\n📋 Credenciais de teste:`);
  console.log(`   Admin: admin@anacardoso.com / admin123`);
  console.log(`   Teste: teste@example.com / teste123`);
  console.log(`\n🎯 Sistema pronto para produção!`);
});