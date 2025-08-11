import { Server as SocketServer } from 'socket.io'
import jwt from 'jsonwebtoken'
import { config } from '@/config/environment'
import { prisma } from '@/config/database'
import { logger } from '@/utils/logger'

interface AuthenticatedSocket extends SocketServer {
  userId?: string
  user?: any
}

export function setupWebSocket(io: SocketServer) {
  // Middleware de autenticação para WebSocket
  io.use(async (socket: any, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '')
      
      if (!token) {
        return next(new Error('Token não fornecido'))
      }

      const decoded = jwt.verify(token, config.jwt.secret) as any
      
      // Verificar se usuário existe
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId }
      })

      if (!user) {
        return next(new Error('Usuário não encontrado'))
      }

      socket.userId = user.id
      socket.user = user
      
      logger.info(`WebSocket: Usuário ${user.email} conectado`, { userId: user.id })
      next()
    } catch (error) {
      logger.error('Erro na autenticação WebSocket:', error)
      next(new Error('Token inválido'))
    }
  })

  // Conexão estabelecida
  io.on('connection', (socket: any) => {
    logger.info(`WebSocket conectado: ${socket.id}`, { userId: socket.userId })

    // Juntar-se a room do usuário
    socket.join(`user:${socket.userId}`)

    // Event: Ping/Pong para manter conexão
    socket.on('ping', () => {
      socket.emit('pong', { timestamp: Date.now() })
    })

    // Event: Juntar-se a room de bot
    socket.on('join_bot', (botId: string) => {
      // Verificar se o bot pertence ao usuário
      prisma.bot.findFirst({
        where: {
          id: botId,
          userId: socket.userId
        }
      }).then(bot => {
        if (bot) {
          socket.join(`bot:${botId}`)
          socket.emit('joined_bot', { botId })
          logger.info(`Usuário ${socket.userId} juntou-se ao bot ${botId}`)
        } else {
          socket.emit('error', { message: 'Bot não encontrado' })
        }
      }).catch(error => {
        logger.error('Erro ao verificar bot:', error)
        socket.emit('error', { message: 'Erro interno' })
      })
    })

    // Event: Sair de room de bot
    socket.on('leave_bot', (botId: string) => {
      socket.leave(`bot:${botId}`)
      socket.emit('left_bot', { botId })
      logger.info(`Usuário ${socket.userId} saiu do bot ${botId}`)
    })

    // Event: Atualização de fluxo
    socket.on('flow_update', (data: any) => {
      const { botId, flowId, nodes, edges } = data
      
      // Verificar se o bot pertence ao usuário
      prisma.bot.findFirst({
        where: {
          id: botId,
          userId: socket.userId
        }
      }).then(bot => {
        if (bot) {
          // Broadcast para outros usuários conectados ao mesmo bot
          socket.to(`bot:${botId}`).emit('flow_updated', {
            flowId,
            nodes,
            edges,
            updatedBy: socket.user.name,
            timestamp: Date.now()
          })
          
          logger.info(`Fluxo ${flowId} atualizado por ${socket.userId}`)
        }
      }).catch(error => {
        logger.error('Erro ao atualizar fluxo:', error)
      })
    })

    // Event: Status do bot alterado
    socket.on('bot_status_changed', (data: any) => {
      const { botId, active } = data
      
      socket.to(`bot:${botId}`).emit('bot_status_updated', {
        botId,
        active,
        updatedBy: socket.user.name,
        timestamp: Date.now()
      })
    })

    // Event: Nova mensagem recebida pelo bot
    socket.on('bot_message_received', (data: any) => {
      const { botId, message } = data
      
      socket.to(`bot:${botId}`).emit('message_received', {
        botId,
        message,
        timestamp: Date.now()
      })
    })

    // Desconexão
    socket.on('disconnect', (reason) => {
      logger.info(`WebSocket desconectado: ${socket.id}`, { 
        userId: socket.userId,
        reason 
      })
    })

    // Error handling
    socket.on('error', (error: Error) => {
      logger.error('Erro no WebSocket:', error)
    })
  })

  return io
}

// Utility functions para emitir eventos
export class WebSocketEmitter {
  constructor(private io: SocketServer) {}

  // Emitir para usuário específico
  emitToUser(userId: string, event: string, data: any) {
    this.io.to(`user:${userId}`).emit(event, {
      ...data,
      timestamp: Date.now()
    })
    
    logger.info(`Evento ${event} emitido para usuário ${userId}`)
  }

  // Emitir para bot específico
  emitToBot(botId: string, event: string, data: any) {
    this.io.to(`bot:${botId}`).emit(event, {
      ...data,
      timestamp: Date.now()
    })
    
    logger.info(`Evento ${event} emitido para bot ${botId}`)
  }

  // Emitir para todos os usuários
  emitToAll(event: string, data: any) {
    this.io.emit(event, {
      ...data,
      timestamp: Date.now()
    })
    
    logger.info(`Evento ${event} emitido para todos`)
  }

  // Eventos específicos
  notifyBotStatusChange(botId: string, userId: string, active: boolean) {
    this.emitToUser(userId, 'bot_status_changed', {
      botId,
      active
    })
  }

  notifyNewMessage(botId: string, userId: string, message: any) {
    this.emitToUser(userId, 'new_message', {
      botId,
      message
    })
  }

  notifyPaymentUpdate(userId: string, payment: any) {
    this.emitToUser(userId, 'payment_updated', {
      payment
    })
  }

  notifyFlowExecution(botId: string, userId: string, execution: any) {
    this.emitToUser(userId, 'flow_executed', {
      botId,
      execution
    })
  }

  notifyError(userId: string, error: any) {
    this.emitToUser(userId, 'error', {
      error: {
        message: error.message,
        code: error.code || 'UNKNOWN_ERROR'
      }
    })
  }

  notifySystemMaintenance(message: string, scheduledAt?: Date) {
    this.emitToAll('system_maintenance', {
      message,
      scheduledAt
    })
  }

  // Métricas em tempo real
  emitMetricsUpdate(userId: string, metrics: any) {
    this.emitToUser(userId, 'metrics_updated', {
      metrics
    })
  }

  // Analytics em tempo real
  emitAnalyticsUpdate(userId: string, analytics: any) {
    this.emitToUser(userId, 'analytics_updated', {
      analytics
    })
  }
}

// Singleton para usar em outros serviços
let webSocketEmitter: WebSocketEmitter

export function initializeWebSocketEmitter(io: SocketServer) {
  webSocketEmitter = new WebSocketEmitter(io)
  return webSocketEmitter
}

export function getWebSocketEmitter(): WebSocketEmitter {
  if (!webSocketEmitter) {
    throw new Error('WebSocketEmitter não foi inicializado')
  }
  return webSocketEmitter
}