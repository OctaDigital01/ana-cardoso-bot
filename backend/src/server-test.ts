import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'

import { config } from '@/config/environment'
import { logger } from '@/utils/logger'
import { errorHandler } from '@/middlewares/errorHandler'
import { rateLimiter } from '@/middlewares/rateLimiter'
import { routes } from '@/api/routes'

async function startTestServer() {
  try {
    const app = express()

    // Middlewares básicos
    app.use(helmet())
    app.use(cors({
      origin: config.corsOrigin,
      credentials: true,
    }))
    app.use(compression())
    app.use(express.json({ limit: '10mb' }))
    app.use(express.urlencoded({ extended: true, limit: '10mb' }))

    // Rate limiting
    if (config.nodeEnv !== 'development') {
      app.use(rateLimiter)
    }

    // Health check
    app.get('/health', (req, res) => {
      res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: config.nodeEnv,
        message: 'Servidor de teste rodando sem dependências externas'
      })
    })

    // API routes
    app.use('/api/v1', routes)

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
    const server = app.listen(config.port, () => {
      logger.info(`🚀 Servidor de teste iniciado na porta ${config.port}`)
      logger.info(`📊 Ambiente: ${config.nodeEnv}`)
      logger.info(`🌐 API: ${config.apiUrl}/api/v1`)
      logger.info(`📝 Health Check: ${config.apiUrl}/health`)
      logger.info('⚠️  Rodando SEM banco de dados e Redis')
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

  } catch (error) {
    logger.error('Erro ao iniciar servidor de teste:', error)
    process.exit(1)
  }
}

startTestServer()