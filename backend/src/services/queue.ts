import Queue from 'bull'
import { redis } from '@/config/redis'
import { logger } from '@/utils/logger'
import { config } from '@/config/environment'

// Configuração base das filas (só criada se Redis disponível)
let queueConfig: any = null
let queuesEnabled = false

// Filas específicas (inicializadas condicionalmente)
export let emailQueue: Queue | null = null
export let botQueue: Queue | null = null
export let webhookQueue: Queue | null = null
export let paymentQueue: Queue | null = null
export let analyticsQueue: Queue | null = null
export let notificationQueue: Queue | null = null

// Inicializar configuração das filas
function initQueueConfig() {
  if (!config.redisUrl || config.redisUrl === '') {
    return null
  }

  queuesEnabled = true
  
  queueConfig = {
    redis: {
      port: 6379,
      host: config.redisUrl.includes('localhost') ? 'localhost' : config.redisUrl.split('@')[1]?.split(':')[0],
      password: config.redisUrl.includes('@') ? config.redisUrl.split(':')[2]?.split('@')[0] : undefined
    },
    defaultJobOptions: {
      removeOnComplete: 20,
      removeOnFail: 50,
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
    },
  }

  // Criar filas apenas se Redis disponível
  emailQueue = new Queue('email processing', queueConfig)
  botQueue = new Queue('bot operations', queueConfig)
  webhookQueue = new Queue('webhook processing', queueConfig)
  paymentQueue = new Queue('payment processing', queueConfig)
  analyticsQueue = new Queue('analytics processing', queueConfig)
  notificationQueue = new Queue('notification processing', queueConfig)
  
  return queueConfig
}

// Tipos de jobs
export interface EmailJob {
  to: string
  subject: string
  template: string
  data: any
}

export interface BotJob {
  botId: string
  action: 'create' | 'update' | 'delete' | 'activate' | 'deactivate'
  data?: any
}

export interface WebhookJob {
  url: string
  payload: any
  headers?: Record<string, string>
  retries?: number
}

export interface PaymentJob {
  paymentId: string
  action: 'process' | 'refund' | 'verify'
  data?: any
}

export interface AnalyticsJob {
  userId: string
  botId?: string
  event: string
  data: any
}

export interface NotificationJob {
  userId: string
  type: 'email' | 'push' | 'sms'
  content: {
    title: string
    message: string
    data?: any
  }
}

// Processadores de jobs
emailQueue.process('send-email', 5, async (job) => {
  const { to, subject, template, data }: EmailJob = job.data
  
  logger.info(`Processando email para ${to}`, { jobId: job.id })
  
  try {
    // Implementar envio de email aqui
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simular envio
    
    logger.info(`Email enviado com sucesso para ${to}`, { jobId: job.id })
    return { success: true, recipient: to }
  } catch (error) {
    logger.error(`Erro ao enviar email para ${to}:`, error)
    throw error
  }
})

botQueue.process('bot-operation', 10, async (job) => {
  const { botId, action, data }: BotJob = job.data
  
  logger.info(`Processando operação ${action} para bot ${botId}`, { jobId: job.id })
  
  try {
    switch (action) {
      case 'create':
        // Implementar criação de bot
        break
      case 'update':
        // Implementar atualização de bot
        break
      case 'delete':
        // Implementar exclusão de bot
        break
      case 'activate':
        // Implementar ativação de bot
        break
      case 'deactivate':
        // Implementar desativação de bot
        break
    }
    
    logger.info(`Operação ${action} concluída para bot ${botId}`, { jobId: job.id })
    return { success: true, botId, action }
  } catch (error) {
    logger.error(`Erro na operação ${action} do bot ${botId}:`, error)
    throw error
  }
})

webhookQueue.process('send-webhook', 20, async (job) => {
  const { url, payload, headers, retries = 3 }: WebhookJob = job.data
  
  logger.info(`Enviando webhook para ${url}`, { jobId: job.id })
  
  try {
    // Implementar envio de webhook aqui
    await new Promise(resolve => setTimeout(resolve, 500)) // Simular envio
    
    logger.info(`Webhook enviado com sucesso para ${url}`, { jobId: job.id })
    return { success: true, url }
  } catch (error) {
    logger.error(`Erro ao enviar webhook para ${url}:`, error)
    throw error
  }
})

paymentQueue.process('payment-operation', 5, async (job) => {
  const { paymentId, action, data }: PaymentJob = job.data
  
  logger.info(`Processando pagamento ${action} para ${paymentId}`, { jobId: job.id })
  
  try {
    switch (action) {
      case 'process':
        // Implementar processamento de pagamento
        break
      case 'refund':
        // Implementar reembolso
        break
      case 'verify':
        // Implementar verificação de status
        break
    }
    
    logger.info(`Pagamento ${action} concluído para ${paymentId}`, { jobId: job.id })
    return { success: true, paymentId, action }
  } catch (error) {
    logger.error(`Erro no pagamento ${action} para ${paymentId}:`, error)
    throw error
  }
})

analyticsQueue.process('analytics-event', 50, async (job) => {
  const { userId, botId, event, data }: AnalyticsJob = job.data
  
  logger.info(`Processando evento analytics: ${event}`, { jobId: job.id })
  
  try {
    // Implementar processamento de analytics aqui
    await new Promise(resolve => setTimeout(resolve, 100)) // Simular processamento
    
    logger.info(`Evento analytics ${event} processado`, { jobId: job.id })
    return { success: true, event }
  } catch (error) {
    logger.error(`Erro ao processar analytics ${event}:`, error)
    throw error
  }
})

notificationQueue.process('send-notification', 10, async (job) => {
  const { userId, type, content }: NotificationJob = job.data
  
  logger.info(`Enviando notificação ${type} para usuário ${userId}`, { jobId: job.id })
  
  try {
    switch (type) {
      case 'email':
        // Implementar notificação por email
        break
      case 'push':
        // Implementar notificação push
        break
      case 'sms':
        // Implementar notificação SMS
        break
    }
    
    logger.info(`Notificação ${type} enviada para usuário ${userId}`, { jobId: job.id })
    return { success: true, userId, type }
  } catch (error) {
    logger.error(`Erro ao enviar notificação ${type} para ${userId}:`, error)
    throw error
  }
})

// Event listeners para logs
const queues = [emailQueue, botQueue, webhookQueue, paymentQueue, analyticsQueue, notificationQueue]

queues.forEach(queue => {
  queue.on('completed', (job, result) => {
    logger.info(`Job ${job.id} concluído`, { queue: queue.name, result })
  })

  queue.on('failed', (job, err) => {
    logger.error(`Job ${job.id} falhou`, { queue: queue.name, error: err.message })
  })

  queue.on('stalled', (job) => {
    logger.warn(`Job ${job.id} travado`, { queue: queue.name })
  })

  queue.on('progress', (job, progress) => {
    logger.info(`Job ${job.id} progresso: ${progress}%`, { queue: queue.name })
  })
})

// Funções utilitárias para adicionar jobs
export class QueueManager {
  static async addEmailJob(data: EmailJob, options?: any) {
    return emailQueue.add('send-email', data, options)
  }

  static async addBotJob(data: BotJob, options?: any) {
    return botQueue.add('bot-operation', data, options)
  }

  static async addWebhookJob(data: WebhookJob, options?: any) {
    return webhookQueue.add('send-webhook', data, options)
  }

  static async addPaymentJob(data: PaymentJob, options?: any) {
    return paymentQueue.add('payment-operation', data, options)
  }

  static async addAnalyticsJob(data: AnalyticsJob, options?: any) {
    return analyticsQueue.add('analytics-event', data, options)
  }

  static async addNotificationJob(data: NotificationJob, options?: any) {
    return notificationQueue.add('send-notification', data, options)
  }

  // Métodos para gerenciar filas
  static async getQueueStats() {
    const stats = {}
    
    for (const queue of queues) {
      const waiting = await queue.getWaiting()
      const active = await queue.getActive()
      const completed = await queue.getCompleted()
      const failed = await queue.getFailed()
      
      stats[queue.name] = {
        waiting: waiting.length,
        active: active.length,
        completed: completed.length,
        failed: failed.length
      }
    }
    
    return stats
  }

  static async pauseAllQueues() {
    await Promise.all(queues.map(queue => queue.pause()))
    logger.info('Todas as filas foram pausadas')
  }

  static async resumeAllQueues() {
    await Promise.all(queues.map(queue => queue.resume()))
    logger.info('Todas as filas foram retomadas')
  }

  static async cleanAllQueues() {
    await Promise.all(queues.map(async queue => {
      await queue.clean(5000, 'completed')
      await queue.clean(5000, 'failed')
    }))
    logger.info('Todas as filas foram limpas')
  }
}

// Inicializar filas
export async function initializeQueues() {
  // Tentar inicializar configuração das filas
  const config = initQueueConfig()
  
  if (!config) {
    logger.info('📝 Filas desabilitadas - Redis não configurado')
    return
  }

  try {
    logger.info('Inicializando filas de processamento...')
    
    const queues = [emailQueue, botQueue, webhookQueue, paymentQueue, analyticsQueue, notificationQueue].filter(Boolean)
    
    // Testar conectividade
    await Promise.all(queues.map(queue => queue!.isReady()))
    
    // Configurar processadores
    setupProcessors()
    setupEventListeners()
    
    logger.info('✅ Filas de processamento inicializadas com sucesso')
  } catch (error) {
    logger.warn('❌ Filas não disponíveis - processamento será síncrono:', error instanceof Error ? error.message : 'erro desconhecido')
    
    // Don't throw error, just continue without queues
    logger.info('🏃 Servidor continuará com processamento síncrono')
    queuesEnabled = false
  }
}

// Graceful shutdown
export async function closeQueues() {
  try {
    logger.info('Fechando filas...')
    
    await Promise.all(queues.map(queue => queue.close()))
    
    logger.info('✅ Filas fechadas com sucesso')
  } catch (error) {
    logger.error('❌ Erro ao fechar filas:', error)
  }
}

process.on('SIGTERM', closeQueues)
process.on('SIGINT', closeQueues)