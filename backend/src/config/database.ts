import { PrismaClient } from '@prisma/client'
import { logger } from '@/utils/logger'
import { config } from './environment'

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined
}

export const prisma = globalThis.__prisma || new PrismaClient({
  log: config.nodeEnv === 'development' 
    ? ['query', 'error', 'warn'] 
    : ['error'],
  errorFormat: 'pretty',
})

if (config.nodeEnv === 'development') {
  globalThis.__prisma = prisma
}

export async function initializeDatabase() {
  try {
    await prisma.$connect()
    logger.info('✅ Conexão com banco de dados estabelecida')
    
    // Testar conexão
    await prisma.$queryRaw`SELECT 1`
    logger.info('✅ Teste de conexão com banco bem-sucedido')
    
  } catch (error) {
    logger.error('❌ Erro ao conectar com banco de dados:', error)
    throw error
  }
}

export async function closeDatabase() {
  await prisma.$disconnect()
  logger.info('📴 Conexão com banco de dados fechada')
}

// Middleware para logging de queries lentas
if (config.nodeEnv === 'development') {
  prisma.$use(async (params, next) => {
    const start = Date.now()
    const result = await next(params)
    const duration = Date.now() - start
    
    if (duration > 1000) {
      logger.warn(`🐌 Query lenta detectada: ${params.model}.${params.action} (${duration}ms)`)
    }
    
    return result
  })
}

// Graceful shutdown
process.on('beforeExit', async () => {
  await closeDatabase()
})

process.on('SIGINT', async () => {
  await closeDatabase()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  await closeDatabase()
  process.exit(0)
})