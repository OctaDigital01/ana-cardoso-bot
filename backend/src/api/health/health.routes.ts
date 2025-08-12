import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import Redis from 'ioredis'
import os from 'os'

const router = Router()
const prisma = new PrismaClient()
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379')

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy'
  timestamp: string
  uptime: number
  services: {
    database: ServiceStatus
    redis: ServiceStatus
    telegram: ServiceStatus
  }
  system: {
    memory: {
      used: string
      total: string
      percentage: number
    }
    cpu: {
      usage: number
      cores: number
    }
  }
}

interface ServiceStatus {
  status: 'up' | 'down'
  responseTime?: number
  error?: string
}

// Health check principal
router.get('/health', async (req, res) => {
  const startTime = Date.now()
  
  const health: HealthStatus = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    services: {
      database: { status: 'down' },
      redis: { status: 'down' },
      telegram: { status: 'down' }
    },
    system: {
      memory: {
        used: '0',
        total: '0',
        percentage: 0
      },
      cpu: {
        usage: 0,
        cores: os.cpus().length
      }
    }
  }

  // Verificar Database
  try {
    const dbStart = Date.now()
    await prisma.$queryRaw`SELECT 1`
    health.services.database = {
      status: 'up',
      responseTime: Date.now() - dbStart
    }
  } catch (error) {
    health.services.database = {
      status: 'down',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
    health.status = 'degraded'
  }

  // Verificar Redis
  try {
    const redisStart = Date.now()
    await redis.ping()
    health.services.redis = {
      status: 'up',
      responseTime: Date.now() - redisStart
    }
  } catch (error) {
    health.services.redis = {
      status: 'down',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
    health.status = 'degraded'
  }

  // Verificar Telegram API (simulado)
  try {
    // Aqui você pode adicionar uma verificação real da API do Telegram
    health.services.telegram = {
      status: 'up',
      responseTime: 50 // Mock para exemplo
    }
  } catch (error) {
    health.services.telegram = {
      status: 'down',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }

  // Informações do sistema
  const totalMem = os.totalmem()
  const freeMem = os.freemem()
  const usedMem = totalMem - freeMem
  
  health.system.memory = {
    used: `${(usedMem / 1024 / 1024 / 1024).toFixed(2)} GB`,
    total: `${(totalMem / 1024 / 1024 / 1024).toFixed(2)} GB`,
    percentage: Math.round((usedMem / totalMem) * 100)
  }

  // CPU usage (simplificado)
  const cpus = os.cpus()
  let totalIdle = 0
  let totalTick = 0
  
  cpus.forEach(cpu => {
    for (const type in cpu.times) {
      totalTick += cpu.times[type as keyof typeof cpu.times]
    }
    totalIdle += cpu.times.idle
  })
  
  health.system.cpu.usage = Math.round(100 - (100 * totalIdle / totalTick))

  // Determinar status geral
  const downServices = Object.values(health.services).filter(s => s.status === 'down').length
  if (downServices >= 2) {
    health.status = 'unhealthy'
  } else if (downServices === 1) {
    health.status = 'degraded'
  }

  // Responder com código de status apropriado
  const statusCode = health.status === 'healthy' ? 200 : 
                     health.status === 'degraded' ? 206 : 503

  res.status(statusCode).json({
    success: health.status !== 'unhealthy',
    data: health,
    responseTime: Date.now() - startTime
  })
})

// Endpoint simplificado para monitoramento
router.get('/ping', (req, res) => {
  res.json({ 
    success: true, 
    message: 'pong',
    timestamp: new Date().toISOString()
  })
})

// Endpoint de readiness (para Kubernetes/Docker)
router.get('/ready', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`
    await redis.ping()
    res.json({ ready: true })
  } catch (error) {
    res.status(503).json({ ready: false })
  }
})

// Endpoint de liveness (para Kubernetes/Docker)
router.get('/live', (req, res) => {
  res.json({ alive: true })
})

export default router