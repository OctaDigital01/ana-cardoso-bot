import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import Redis from 'ioredis';
import winston from 'winston';

// Initialize services
const app = express();
const prisma = new PrismaClient();
const redis = new Redis(process.env.REDIS_URL!);

// Logger setup
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Environment variables
const {
  PORT = 3333,
  NODE_ENV = 'production',
  JWT_SECRET,
  JWT_REFRESH_SECRET,
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  FRONTEND_URL = 'https://ana-cardoso-bot-v2.vercel.app'
} = process.env;

// Email transporter
const emailTransporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: parseInt(SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS
  }
});

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
    }
  }
}));

app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW || '60000'),
  max: parseInt(process.env.RATE_LIMIT_MAX || '100'),
  message: { error: 'Too many requests from this IP' }
});
app.use(limiter);

// CORS configuration
app.use(cors({
  origin: [
    'http://localhost:3001',
    'https://ana-cardoso-bot-v2.vercel.app',
    'https://frontend-production-86d2.up.railway.app',
    FRONTEND_URL
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path} - ${req.ip}`);
  next();
});

// Google OAuth setup (only if credentials are provided)
if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails?.[0]?.value;
      if (!email) {
        return done(new Error('No email from Google'), null);
      }

      let user = await prisma.user.findUnique({ where: { email } });
      
      if (!user) {
        user = await prisma.user.create({
          data: {
            email,
            name: profile.displayName || 'Google User',
            avatar: profile.photos?.[0]?.value,
            password: crypto.randomBytes(32).toString('hex'),
            plan: 'FREE',
            active: true,
            emailVerified: true,
            provider: 'GOOGLE',
            googleId: profile.id
          }
        });
      }

      return done(null, user);
    } catch (error) {
      logger.error('Google OAuth error:', error);
      return done(error, null);
    }
  }));
}

app.use(passport.initialize());

// Auth middleware
const authenticateToken = async (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET!) as any;
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, name: true, plan: true }
    });

    if (!user) {
      return res.status(403).json({ message: 'Invalid token' });
    }

    req.user = user;
    next();
  } catch (error) {
    logger.error('JWT verification error:', error);
    return res.status(403).json({ message: 'Invalid token' });
  }
};

// Utility functions
const generateTokens = (user: any) => {
  const accessToken = jwt.sign(
    { userId: user.id, email: user.email },
    JWT_SECRET!,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { userId: user.id },
    JWT_REFRESH_SECRET!,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
};

const sendVerificationEmail = async (email: string, token: string) => {
  const verificationUrl = `${FRONTEND_URL}/verify-email?token=${token}`;
  
  await emailTransporter.sendMail({
    from: SMTP_USER,
    to: email,
    subject: 'Confirme seu email - Ana Cardoso Bot',
    html: `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
        <h1 style="color: #3b82f6; text-align: center;">Ana Cardoso Bot</h1>
        <h2>Confirme seu email</h2>
        <p>Obrigado por se cadastrar! Clique no link abaixo para confirmar seu email:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" style="background: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Confirmar Email
          </a>
        </div>
        <p>Se você não se cadastrou, ignore este email.</p>
        <p><small>Este link expira em 24 horas.</small></p>
      </div>
    `
  });
};

// Routes

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
    version: '1.0.0'
  });
});

// Auth routes
app.post('/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Nome, email e senha são obrigatórios' });
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email já está em uso' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate email verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        plan: 'FREE',
        active: false // Will be activated after email verification
      }
    });

    // Store verification token in Redis
    await redis.setex(`email_verification:${verificationToken}`, 86400, user.id);

    // Send verification email
    await sendVerificationEmail(email, verificationToken);

    logger.info(`User registered: ${email}`);
    
    res.status(201).json({
      message: 'Usuário criado! Verifique seu email para ativar a conta.',
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (error) {
    logger.error('Registration error:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

app.post('/auth/verify-email', async (req, res) => {
  try {
    const { token } = req.body;

    const userId = await redis.get(`email_verification:${token}`);
    if (!userId) {
      return res.status(400).json({ message: 'Token inválido ou expirado' });
    }

    // Activate user
    const user = await prisma.user.update({
      where: { id: userId },
      data: { active: true }
    });

    // Remove verification token
    await redis.del(`email_verification:${token}`);

    // Generate auth tokens
    const tokens = generateTokens(user);

    logger.info(`Email verified for user: ${user.email}`);

    res.json({
      message: 'Email confirmado com sucesso!',
      user: { id: user.id, name: user.name, email: user.email, plan: user.plan },
      ...tokens
    });
  } catch (error) {
    logger.error('Email verification error:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email e senha são obrigatórios' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    if (!user.active) {
      return res.status(401).json({ message: 'Conta não verificada. Verifique seu email.' });
    }

    const tokens = generateTokens(user);

    logger.info(`User logged in: ${email}`);

    res.json({
      user: { id: user.id, name: user.name, email: user.email, plan: user.plan },
      ...tokens
    });
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Google OAuth routes (only if configured)
if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET) {
  app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
  );

  app.get('/auth/google/callback',
    passport.authenticate('google', { session: false }),
    async (req: any, res) => {
      try {
        const tokens = generateTokens(req.user);
        
        // Redirect to frontend with tokens
        res.redirect(`${FRONTEND_URL}/auth/callback?token=${tokens.accessToken}&refresh=${tokens.refreshToken}`);
      } catch (error) {
        logger.error('Google callback error:', error);
        res.redirect(`${FRONTEND_URL}/login?error=google_auth_failed`);
      }
    }
  );
} else {
  // Fallback routes when Google OAuth is not configured
  app.get('/auth/google', (req, res) => {
    res.status(501).json({ message: 'Google OAuth not configured' });
  });

  app.get('/auth/google/callback', (req, res) => {
    res.redirect(`${FRONTEND_URL}/login?error=google_auth_not_configured`);
  });
}

app.post('/auth/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token required' });
    }

    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET!) as any;
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, name: true, plan: true }
    });

    if (!user) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    const tokens = generateTokens(user);
    res.json(tokens);
  } catch (error) {
    logger.error('Token refresh error:', error);
    res.status(403).json({ message: 'Invalid refresh token' });
  }
});

app.get('/auth/me', authenticateToken, (req: any, res) => {
  res.json(req.user);
});

// Bots API
app.get('/api/v1/bots', authenticateToken, async (req: any, res) => {
  try {
    const bots = await prisma.bot.findMany({
      where: { userId: req.user.id },
      select: {
        id: true,
        username: true,
        firstName: true,
        name: true,
        description: true,
        active: true,
        webhookUrl: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            conversations: true,
            messages: true
          }
        }
      }
    });

    res.json(bots.map(bot => ({
      ...bot,
      isActive: bot.active,
      messageCount: bot._count.messages,
      userCount: bot._count.conversations
    })));
  } catch (error) {
    logger.error('Get bots error:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

app.post('/api/v1/bots', authenticateToken, async (req: any, res) => {
  try {
    const { name, token, description } = req.body;

    if (!name || !token) {
      return res.status(400).json({ message: 'Nome e token são obrigatórios' });
    }

    // Verify bot token with Telegram API
    const telegramResponse = await fetch(`https://api.telegram.org/bot${token}/getMe`);
    const telegramData = await telegramResponse.json();

    if (!telegramData.ok) {
      return res.status(400).json({ message: 'Token do bot inválido' });
    }

    const botInfo = telegramData.result;

    // Check if bot already exists
    const existingBot = await prisma.bot.findUnique({ where: { token } });
    if (existingBot) {
      return res.status(400).json({ message: 'Este bot já está cadastrado' });
    }

    const bot = await prisma.bot.create({
      data: {
        userId: req.user.id,
        token,
        username: botInfo.username,
        firstName: botInfo.first_name,
        name: name,
        description: description || '',
        active: false
      }
    });

    res.status(201).json({
      ...bot,
      isActive: bot.active,
      messageCount: 0,
      userCount: 0
    });
  } catch (error) {
    logger.error('Create bot error:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

app.patch('/api/v1/bots/:id/toggle', authenticateToken, async (req: any, res) => {
  try {
    const { id } = req.params;

    const bot = await prisma.bot.findFirst({
      where: { id, userId: req.user.id }
    });

    if (!bot) {
      return res.status(404).json({ message: 'Bot não encontrado' });
    }

    const updatedBot = await prisma.bot.update({
      where: { id },
      data: { active: !bot.active }
    });

    res.json({
      ...updatedBot,
      isActive: updatedBot.active
    });
  } catch (error) {
    logger.error('Toggle bot error:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Analytics API
app.get('/api/v1/analytics/dashboard', authenticateToken, async (req: any, res) => {
  try {
    const [totalBots, totalConversations, totalMessages] = await Promise.all([
      prisma.bot.count({ where: { userId: req.user.id } }),
      prisma.conversation.count({
        where: { bot: { userId: req.user.id } }
      }),
      prisma.interaction.count({
        where: {
          conversation: {
            bot: { userId: req.user.id }
          },
          type: 'MESSAGE_SENT'
        }
      })
    ]);

    // Mock revenue data for now
    const revenue = 2340.50;

    res.json({
      totalBots,
      activeUsers: totalConversations,
      messagesThisMonth: totalMessages,
      revenue,
      growth: {
        bots: 12,
        users: 23,
        messages: 18,
        revenue: 15
      },
      chartData: [
        { month: 'Jan', messages: 2400, users: 400, revenue: 800 },
        { month: 'Fev', messages: 1398, users: 600, revenue: 1200 },
        { month: 'Mar', messages: 9800, users: 800, revenue: 1600 },
        { month: 'Abr', messages: 3908, users: 1000, revenue: 2000 },
        { month: 'Mai', messages: 4800, users: 1200, revenue: 2340 }
      ],
      recentActivity: [
        {
          id: '1',
          type: 'message',
          description: 'Mensagem automática enviada para 23 usuários',
          time: 'há 5 minutos'
        },
        {
          id: '2',
          type: 'user',
          description: 'Novo usuário iniciou conversa',
          time: 'há 12 minutos'
        }
      ]
    });
  } catch (error) {
    logger.error('Analytics error:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Leads capture
app.post('/api/v1/leads', async (req, res) => {
  try {
    const { 
      name, 
      email, 
      phone, 
      message, 
      source = 'website',
      utmSource,
      utmMedium,
      utmCampaign
    } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: 'Nome e email são obrigatórios' });
    }

    // Check if lead already exists
    const existingLead = await prisma.lead.findFirst({
      where: { email }
    });

    let lead;
    if (existingLead) {
      // Update existing lead
      lead = await prisma.lead.update({
        where: { id: existingLead.id },
        data: {
          name,
          phone,
          message,
          source,
          utmSource,
          utmMedium,
          utmCampaign,
          ipAddress: req.ip,
          userAgent: req.get('User-Agent'),
          metadata: {
            lastUpdate: new Date().toISOString(),
            updateCount: (existingLead.metadata as any)?.updateCount ? 
              (existingLead.metadata as any).updateCount + 1 : 1
          }
        }
      });
    } else {
      // Create new lead
      lead = await prisma.lead.create({
        data: {
          name,
          email,
          phone,
          message,
          source,
          status: 'NEW',
          utmSource,
          utmMedium,
          utmCampaign,
          ipAddress: req.ip,
          userAgent: req.get('User-Agent'),
          metadata: {
            firstCapture: new Date().toISOString()
          }
        }
      });
    }

    // Send notification email to admin
    try {
      await emailTransporter.sendMail({
        from: SMTP_USER,
        to: 'admin@anacardoso.com',
        subject: existingLead ? 'Lead Atualizado' : 'Novo Lead Capturado',
        html: `
          <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
            <h1 style="color: #3b82f6;">Ana Cardoso Bot</h1>
            <h2>${existingLead ? 'Lead Atualizado' : 'Novo Lead Capturado'}</h2>
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Nome:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Telefone:</strong> ${phone || 'Não informado'}</p>
              <p><strong>Mensagem:</strong> ${message || 'Nenhuma mensagem'}</p>
              <p><strong>Origem:</strong> ${source}</p>
              ${utmSource ? `<p><strong>UTM Source:</strong> ${utmSource}</p>` : ''}
              ${utmMedium ? `<p><strong>UTM Medium:</strong> ${utmMedium}</p>` : ''}
              ${utmCampaign ? `<p><strong>UTM Campaign:</strong> ${utmCampaign}</p>` : ''}
              <p><strong>IP:</strong> ${req.ip}</p>
              <p><strong>Data:</strong> ${new Date().toLocaleString('pt-BR')}</p>
            </div>
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://ana-cardoso-bot-v2.vercel.app/admin/leads" style="background: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Ver Todos os Leads
              </a>
            </div>
          </div>
        `
      });
    } catch (emailError) {
      logger.error('Failed to send lead notification email:', emailError);
    }

    logger.info(`Lead ${existingLead ? 'updated' : 'captured'}: ${email}`);
    
    res.json({ 
      message: existingLead ? 'Lead atualizado com sucesso!' : 'Lead capturado com sucesso!',
      leadId: lead.id,
      isNew: !existingLead
    });
  } catch (error) {
    logger.error('Lead capture error:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Admin endpoints for leads management
app.get('/api/v1/admin/leads', authenticateToken, async (req: any, res) => {
  try {
    // Only allow admin users
    if (req.user.email !== 'admin@anacardoso.com') {
      return res.status(403).json({ message: 'Acesso negado' });
    }

    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100 // Limit to last 100 leads
    });

    res.json(leads);
  } catch (error) {
    logger.error('Get leads error:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

app.patch('/api/v1/admin/leads/:id/status', authenticateToken, async (req: any, res) => {
  try {
    // Only allow admin users
    if (req.user.email !== 'admin@anacardoso.com') {
      return res.status(403).json({ message: 'Acesso negado' });
    }

    const { id } = req.params;
    const { status } = req.body;

    const lead = await prisma.lead.update({
      where: { id },
      data: { 
        status,
        convertedAt: status === 'CONVERTED' ? new Date() : null
      }
    });

    res.json(lead);
  } catch (error) {
    logger.error('Update lead status error:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Error handling
app.use((error: any, req: any, res: any, next: any) => {
  logger.error('Global error:', error);
  res.status(500).json({
    message: 'Erro interno do servidor',
    error: NODE_ENV === 'development' ? error.message : undefined
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    message: 'Endpoint não encontrado',
    path: req.originalUrl
  });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  await prisma.$disconnect();
  await redis.quit();
  process.exit(0);
});

app.listen(PORT, '0.0.0.0', () => {
  logger.info(`🚀 Production server running on port ${PORT}`);
  logger.info(`🌐 Environment: ${NODE_ENV}`);
  logger.info(`📊 Health check: http://localhost:${PORT}/health`);
});

export default app;