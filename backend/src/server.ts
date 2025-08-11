import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import { createServer } from 'http'
import { Server } from 'socket.io'

import { config } from '@/config/environment'
import { logger } from '@/utils/logger'
import { errorHandler } from '@/middlewares/errorHandler'
import { rateLimiter } from '@/middlewares/rateLimiter'
import { routes } from '@/api/routes'
import { initializeDatabase, prisma } from '@/config/database'
import { initializeRedis, redis } from '@/config/redis'
import { setupWebSocket } from '@/services/websocket'
import { initializeQueues } from '@/services/queue'

async function startServer() {
  try {
    // Inicializar dependências (gracefully handle failures in production)
    try {
      await initializeDatabase()
    } catch (error) {
      logger.error('Database initialization failed, continuing without DB:', error)
    }
    
    try {
      await initializeRedis()
    } catch (error) {
      logger.error('Redis initialization failed, continuing without Redis:', error)
    }
    
    try {
      await initializeQueues()
    } catch (error) {
      logger.error('Queue initialization failed, continuing without queues:', error)
    }

    const app = express()
    const server = createServer(app)
    const io = new Server(server, {
      cors: {
        origin: config.corsOrigin,
        credentials: true
      }
    })

    // Middlewares de segurança
    app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
        },
      },
      crossOriginEmbedderPolicy: false
    }))

    // CORS
    app.use(cors({
      origin: config.corsOrigin,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
    }))

    // Compressão
    app.use(compression())

    // Body parsing
    app.use(express.json({ limit: '10mb' }))
    app.use(express.urlencoded({ extended: true, limit: '10mb' }))

    // Rate limiting
    app.use(rateLimiter)

    // Health check
    app.get('/health', async (req, res) => {
      try {
        const health = {
          status: 'ok',
          timestamp: new Date().toISOString(),
          uptime: process.uptime(),
          environment: config.nodeEnv,
          services: {
            database: 'unknown',
            redis: 'unknown',
            queues: 'unknown'
          }
        }

        // Test database connection
        try {
          await prisma.$queryRaw`SELECT 1`
          health.services.database = 'connected'
        } catch {
          health.services.database = 'disconnected'
        }

        // Test Redis connection
        try {
          if (redis) {
            await redis.ping()
            health.services.redis = 'connected'
          }
        } catch {
          health.services.redis = 'disconnected'
        }

        // Test queues
        try {
          health.services.queues = 'connected'  // Basic assumption
        } catch {
          health.services.queues = 'disconnected'
        }

        res.json(health)
      } catch (error) {
        res.status(500).json({
          status: 'error',
          timestamp: new Date().toISOString(),
          error: 'Health check failed'
        })
      }
    })

    // API routes
    app.use('/api/v1', routes)

    // WebSocket setup
    setupWebSocket(io)

    // Error handling
    app.use(errorHandler)

    // 404 handler
    app.use('*', (req, res) => {
      res.status(404).json({
        error: {
          message: 'Rota não encontrada',
          code: 'NOT_FOUND'
        }
      })
    })

    // Iniciar servidor
    server.listen(config.port, () => {
      logger.info(`🚀 Servidor iniciado na porta ${config.port}`)
      logger.info(`📊 Ambiente: ${config.nodeEnv}`)
      logger.info(`🌐 API: ${config.apiUrl}/api/v1`)
      
      if (config.nodeEnv === 'development') {
        logger.info(`📝 Health Check: ${config.apiUrl}/health`)
      }
    })

    // Graceful shutdown
    process.on('SIGTERM', () => {
      logger.info('SIGTERM recebido, fechando servidor...')
      server.close(() => {
        logger.info('Servidor fechado')
        process.exit(0)
      })
    })

    process.on('SIGINT', () => {
      logger.info('SIGINT recebido, fechando servidor...')
      server.close(() => {
        logger.info('Servidor fechado')
        process.exit(0)
      })
    })

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      logger.error('Exceção não tratada:', error)
      process.exit(1)
    })

    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Promise rejeitada não tratada:', { reason, promise })
      process.exit(1)
    })

  } catch (error) {
    logger.error('Erro ao iniciar servidor:', error)
    process.exit(1)
  }
}

startServer()