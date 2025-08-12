import { z } from 'zod'

const envSchema = z.object({
  // Aplicação
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default('3333'),
  API_URL: z.string().default('http://localhost:3333'),

  // Banco de dados
  DATABASE_URL: z.string().min(1, 'DATABASE_URL é obrigatório'),

  // Redis
  REDIS_URL: z.string().optional().default(''),

  // JWT
  JWT_SECRET: z.string().min(32, 'JWT_SECRET deve ter pelo menos 32 caracteres'),
  JWT_REFRESH_SECRET: z.string().min(32, 'JWT_REFRESH_SECRET deve ter pelo menos 32 caracteres'),
  JWT_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),

  // Criptografia
  ENCRYPTION_KEY: z.string().min(32, 'ENCRYPTION_KEY deve ter 32 caracteres'),

  // Telegram
  TELEGRAM_WEBHOOK_DOMAIN: z.string().url().optional(),

  // Pagamento
  MERCADOPAGO_ACCESS_TOKEN: z.string().optional(),
  MERCADOPAGO_PUBLIC_KEY: z.string().optional(),
  MERCADOPAGO_WEBHOOK_SECRET: z.string().optional(),

  // Email
  SMTP_HOST: z.string().default('smtp.gmail.com'),
  SMTP_PORT: z.string().transform(Number).default('587'),
  SMTP_SECURE: z.string().transform(Boolean).default('false'),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),

  // AWS S3
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  AWS_REGION: z.string().default('us-east-1'),
  S3_BUCKET: z.string().optional(),

  // Rate Limiting
  RATE_LIMIT_WINDOW: z.string().transform(Number).default('60000'),
  RATE_LIMIT_MAX: z.string().transform(Number).default('100'),

  // Logs
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  LOG_TO_FILE: z.string().transform(Boolean).default('false'),

  // Monitoramento
  SENTRY_DSN: z.string().optional(),

  // Supabase
  SUPABASE_URL: z.string().url().optional(),
  SUPABASE_ANON_KEY: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),

  // Features
  ENABLE_REGISTRATION: z.string().transform(Boolean).default('true'),
  ENABLE_EMAIL_VERIFICATION: z.string().transform(Boolean).default('false'),
  ENABLE_PASSWORD_RESET: z.string().transform(Boolean).default('true'),
  ENABLE_TWO_FACTOR: z.string().transform(Boolean).default('false'),

  // Debug
  DEBUG: z.string().optional(),
  ENABLE_SWAGGER: z.string().transform(Boolean).default('false'),
})

const parseResult = envSchema.safeParse(process.env)

if (!parseResult.success) {
  console.error('❌ Configuração de ambiente inválida:')
  console.error(parseResult.error.format())
  process.exit(1)
}

export const config = {
  // Aplicação
  nodeEnv: parseResult.data.NODE_ENV,
  port: parseResult.data.PORT,
  apiUrl: parseResult.data.API_URL,
  
  // Banco de dados
  databaseUrl: parseResult.data.DATABASE_URL,
  
  // Redis
  redisUrl: parseResult.data.REDIS_URL,
  
  // JWT
  jwtSecret: parseResult.data.JWT_SECRET,
  jwt: {
    secret: parseResult.data.JWT_SECRET,
    refreshSecret: parseResult.data.JWT_REFRESH_SECRET,
    expiresIn: parseResult.data.JWT_EXPIRES_IN,
    refreshExpiresIn: parseResult.data.JWT_REFRESH_EXPIRES_IN,
  },
  
  // Criptografia
  encryptionKey: parseResult.data.ENCRYPTION_KEY,
  
  // Telegram
  telegram: {
    webhookDomain: parseResult.data.TELEGRAM_WEBHOOK_DOMAIN,
  },
  
  // Pagamento
  mercadoPago: {
    accessToken: parseResult.data.MERCADOPAGO_ACCESS_TOKEN,
    publicKey: parseResult.data.MERCADOPAGO_PUBLIC_KEY,
    webhookSecret: parseResult.data.MERCADOPAGO_WEBHOOK_SECRET,
  },
  
  // Email
  smtp: {
    host: parseResult.data.SMTP_HOST,
    port: parseResult.data.SMTP_PORT,
    secure: parseResult.data.SMTP_SECURE,
    user: parseResult.data.SMTP_USER,
    pass: parseResult.data.SMTP_PASS,
  },
  
  // AWS S3
  aws: {
    accessKeyId: parseResult.data.AWS_ACCESS_KEY_ID,
    secretAccessKey: parseResult.data.AWS_SECRET_ACCESS_KEY,
    region: parseResult.data.AWS_REGION,
    s3Bucket: parseResult.data.S3_BUCKET,
  },
  
  // Rate Limiting
  rateLimit: {
    window: parseResult.data.RATE_LIMIT_WINDOW,
    max: parseResult.data.RATE_LIMIT_MAX,
  },
  
  // Logs
  log: {
    level: parseResult.data.LOG_LEVEL,
    toFile: parseResult.data.LOG_TO_FILE,
  },
  
  // Monitoramento
  sentryDsn: parseResult.data.SENTRY_DSN,
  
  // Supabase
  supabase: {
    url: parseResult.data.SUPABASE_URL,
    anonKey: parseResult.data.SUPABASE_ANON_KEY,
    serviceRoleKey: parseResult.data.SUPABASE_SERVICE_ROLE_KEY,
  },
  
  // Features
  features: {
    registration: parseResult.data.ENABLE_REGISTRATION,
    emailVerification: parseResult.data.ENABLE_EMAIL_VERIFICATION,
    passwordReset: parseResult.data.ENABLE_PASSWORD_RESET,
    twoFactor: parseResult.data.ENABLE_TWO_FACTOR,
  },
  
  // CORS
  corsOrigin: parseResult.data.NODE_ENV === 'production' 
    ? ['https://app.telegrambotmanager.com'] 
    : ['http://localhost:3000', 'http://localhost:3001'],
    
  // Debug
  debug: parseResult.data.DEBUG,
  enableSwagger: parseResult.data.ENABLE_SWAGGER,
} as const

export type Config = typeof config